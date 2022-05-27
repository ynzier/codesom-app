import React, { useState, useEffect } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  Divider,
  FlatList,
} from "native-base";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { StyleSheet, Platform } from "react-native";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { employeeService } from "services";
import { FontAwesome5 } from "@expo/vector-icons";
import { Dropdown } from "ynzier-react-native-element-dropdown";

dayjs.extend(localizedFormat);
type empDataTS = {
  empId: number;
  firstName: string;
  lastName: string;
}[];
const ReportSidebar: React.FC = () => {
  const { promiseInProgress: isFetching } = usePromiseTracker({
    area: "isFetching",
  });
  const [empId, setEmpId] = useState(undefined);
  const [empData, setEmpData] = useState<empDataTS>([]);
  const fetching = async () => {
    await trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            employeeService.getAllEmployeeInBranch().then((res) => {
              const data = res.data.employees;
              const newList: any = [];
              data.forEach(
                (obj: { empId: any; firstName: string; lastName: string }) => {
                  newList.push({
                    value: obj.empId,
                    label: obj.firstName + " " + obj.lastName,
                  });
                }
              );
              setEmpData(newList);
            })
          );
        }, 1000);
      }),
      "isFetching"
    );
  };

  const signEmp = async () => {
    if (empId != undefined)
      await employeeService
        .empSignCheck(empId)
        .then((res) =>
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            textBody: res.data.message,
          })
        )
        .catch((error) =>
          Toast.show({
            type: ALERT_TYPE.DANGER,
            textBody: error.response.status,
          })
        );
    else
      Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: "กรุณาเลือกรายการด้านบนก่อน!",
      });
  };
  const renderEmpItem = (item: any) => {
    return (
      <Box style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </Box>
    );
  };
  useEffect(() => {
    void fetching();
    return () => {
      setEmpData([]);
      setEmpId(undefined);
    };
  }, []);

  return (
    <>
      <HStack w="100%" flex="1" bg="#FFF0D9">
        <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
          <Box
            flex="10"
            w="90%"
            h="100%"
            justifyContent="center"
            shadow={3}
            style={styles.flatlist}
          >
            <Text fontSize={"md"} fontWeight={600} alignSelf="center">
              รายชื่อพนักงาน
            </Text>
            <Divider
              alignSelf="center"
              thickness="1"
              width="90%"
              bg="light.300"
            />
            <FlatList
              data={empData}
              refreshing={isFetching}
              onRefresh={() => void fetching()}
              keyExtractor={(item: any) => item.value}
              renderItem={({ item }: any) => {
                return (
                  <Box key={item.value}>
                    <Box style={styles.container}>
                      <HStack>
                        <VStack flex="1">
                          <Text fontSize={12}>รหัสพนักงาน #{item.value}</Text>
                          <Text fontSize={12}>{item.label}</Text>
                        </VStack>
                      </HStack>
                    </Box>
                    <Divider
                      alignSelf="center"
                      thickness="1"
                      width="90%"
                      bg="light.200"
                    />
                  </Box>
                );
              }}
            />
          </Box>
          {/* Bottom */}
          <Box flex="1" w="90%" h="100%" bg="#FFF0D9" alignItems="center">
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              fontFamily="Prompt-Regular"
              iconStyle={styles.iconStyle}
              data={empData}
              dropdownPosition={Platform.OS === "ios" ? "auto" : "bottom"}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="รายชื่อพนักงาน"
              value={empId || null}
              onChange={(item) => {
                setEmpId(item.value);
              }}
              renderLeftIcon={() => (
                <FontAwesome5
                  name="signature"
                  style={styles.icon}
                  size={24}
                  color="black"
                />
              )}
              renderItem={renderEmpItem}
            />
          </Box>

          <Box
            flex="1"
            w="100%"
            h="100%"
            bg="#FFF0D9"
            px="4"
            alignItems="center"
          >
            <Button
              borderRadius="xl"
              colorScheme="emerald"
              mx="4"
              w="100%"
              h="75%"
              onPress={() => void signEmp()}
            >
              ลงชื่อ
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default ReportSidebar;

const styles = StyleSheet.create({
  container: { padding: 12, marginBottom: 2 },
  lookup: { textDecorationLine: "underline", color: "#848484" },
  flatlist: {
    margin: 16,
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#fafaf9",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#d6d3d1",
    height: "95%",
    elevation: 2,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#f4f4f4",
    height: 50,
    width: "100%",
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexGrow: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 3,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: { width: 32, marginRight: 4, height: 32 },
  quantityText: { textAlign: "right", textDecorationLine: "underline" },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1,
  },
  textSelectedStyle: {
    fontFamily: "Prompt-SemiBold",
    color: "#949494",
    marginRight: 8,
    fontSize: 16,
  },
  selectedIcon: { color: "#545454", fontSize: 18, marginLeft: 4 },
  selectItemType: { marginLeft: 8, fontSize: 16 },
  selectItemIcon: {
    marginRight: 5,
  },
});
