/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  ScrollView,
  Spinner,
  Divider,
  Collapse,
  View,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { employeeService, requisitionService } from "services";
import { StyleSheet, Platform } from "react-native";
import { Dropdown } from "ynzier-react-native-element-dropdown";
dayjs.extend(localizedFormat);

const RequisitionDetail = ({
  showDetail,
  setShowDetail,
  reqId,
}: {
  showDetail: boolean;
  setShowDetail: (boolean: boolean) => void;
  reqId: number;
  props?: any;
}) => {
  const { promiseInProgress } = usePromiseTracker();
  const [requisitData, setRequisitData] = useState<any>({});
  const [empList, setEmpList] = useState([]);
  const [validatorId, setValidatorId] = useState<number>();
  const [productList, setProductList] = useState([]);
  const [ingrList, setIngrList] = useState([]);
  const [stuffList, setStuffList] = useState([]);
  const [error, setError] = useState("");

  const validateStatus = () => {
    const data = { status: 3, validatorId: validatorId };

    void trackPromise(
      requisitionService
        .updateReqStatus(reqId, data)
        .then((res) => {
          setError("");
          setShowDetail(false);
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setError(resMessage);
        })
    );
  };

  useEffect(() => {
    if (reqId) {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              requisitionService
                .getReqDetailById(reqId)
                .then((res) => {
                  setRequisitData(res.data.requisitionData);
                })
                .catch((e) => {
                  console.log(e);
                })
            );
            resolve(
              requisitionService
                .getReqItemsById(reqId)
                .then((res) => {
                  setProductList(res.data.productArray);
                  setIngrList(res.data.ingrArray);
                  setStuffList(res.data.stuffArray);
                })
                .catch((e) => {
                  console.log(e);
                })
            );
            resolve(
              employeeService
                .getAllEmployeeInBranch()
                .then((res) => {
                  if (res && res.data.employees) {
                    const data = res.data.employees;
                    const newList: any = [];
                    data.forEach(
                      (obj: {
                        empId: any;
                        firstName: string;
                        lastName: string;
                      }) => {
                        newList.push({
                          value: obj.empId,
                          label: obj.firstName + " " + obj.lastName,
                        });
                      }
                    );
                    setEmpList(newList);
                  }
                })
                .catch((e) => {
                  console.log(e);
                })
            );
          }, 2000);
        })
      );
    }

    return () => {
      setError("");
      setProductList([]);
      setIngrList([]);
      setStuffList([]);
      setValidatorId(undefined);
    };
  }, [reqId]);

  const renderEmpItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };
  return (
    <Center>
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} size="lg">
        <Modal.Content h="700" maxWidth="450" justifyContent="center" pb="3">
          {promiseInProgress ? (
            <Spinner size="lg" color="cream" />
          ) : (
            <>
              <Modal.CloseButton />
              <Modal.Header mx="4" borderBottomWidth={1} alignItems="center">
                <Text fontSize="lg">ใบเบิกคลังสินค้า</Text>
              </Modal.Header>
              <Modal.Body>
                <ScrollView>
                  <Box mx="4" w="80%" alignSelf="center" mb="4">
                    <VStack justifyContent="center" space={2} mt={6} mb="2">
                      <HStack>
                        <Text fontSize="lg" flex="1">
                          เลขที่ใบเบิกสินค้า: {reqId}
                        </Text>
                        <Text fontSize="lg" flex="1" textAlign="right">
                          สถานะ:{" "}
                          {requisitData.requisitionStatus == 0
                            ? "รออนุมัติ"
                            : requisitData.requisitionStatus == 1
                            ? "อนุมัติแล้ว"
                            : requisitData.requisitionStatus == 2
                            ? "กำลังจัดส่ง"
                            : requisitData.requisitionStatus == 3
                            ? "เสร็จสิ้น"
                            : "ยกเลิก"}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text flex="1">
                          วันที่/เวลา:{" "}
                          {dayjs(requisitData.createdAt)
                            .locale("th")
                            .format("D MMMM YYYY เวลา HH:mm")}
                          receiptData.recTimestamp
                        </Text>
                        <Text>13 รายการ</Text>
                      </HStack>
                    </VStack>
                    <Divider mb="4" />
                    <HStack mx="2" mb="1">
                      <Text flex="1">รายการ</Text>
                    </HStack>
                    <HStack ml="4">
                      <Text>สินค้า </Text>
                    </HStack>
                    <VStack ml={6}>
                      {productList.length > 0 &&
                        productList.map((item: any) => (
                          <HStack key={item.prodId}>
                            <Text flex="1">- {item.prodName}</Text>
                            <Text textAlign="center" flex="1">
                              {item.quantity} {item.prodUnit}
                            </Text>
                          </HStack>
                        ))}
                      {productList.length < 1 && (
                        <HStack>
                          <Text flex="1" color="light.500">
                            ไม่มีรายการ
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                    <HStack ml="4" mt="1">
                      <Text>วัตถุดิบ </Text>
                    </HStack>
                    <VStack ml={6}>
                      {ingrList.length > 0 &&
                        ingrList.map((item: any) => (
                          <HStack key={item.ingrId}>
                            <Text flex="1">- {item.ingrName}</Text>
                            <Text textAlign="center" flex="1">
                              {item.quantity} {item.ingrUnit}
                            </Text>
                          </HStack>
                        ))}
                      {ingrList.length < 1 && (
                        <HStack>
                          <Text flex="1" color="light.500">
                            ไม่มีรายการ
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                    <HStack ml="4" mt="1">
                      <Text>อื่นๆ </Text>
                    </HStack>
                    <VStack ml={6}>
                      {stuffList.length > 0 &&
                        stuffList.map((item: any) => (
                          <HStack key={item.stuffId}>
                            <Text flex="1">- {item.stuffName}</Text>
                            <Text textAlign="center" flex="1">
                              {item.quantity} {item.stuffUnit}
                            </Text>
                          </HStack>
                        ))}
                      {stuffList.length < 1 && (
                        <HStack>
                          <Text flex="1" color="light.500">
                            ไม่มีรายการ
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                  <HStack>
                    <VStack flex="1" alignItems="center">
                      <Text>
                        {requisitData.creator && requisitData.creator.firstName}{" "}
                        {requisitData.creator && requisitData.creator.lastName}
                      </Text>
                      <Text>ผู้ทำรายการ</Text>
                    </VStack>
                    <VStack flex="1" alignItems="center">
                      <Text>
                        {requisitData.approver &&
                          requisitData.approver.firstName}{" "}
                        {requisitData.approver &&
                          requisitData.approver.lastName}
                      </Text>
                      <Text>ผู้อนุมัติ</Text>
                    </VStack>
                  </HStack>
                  <VStack flex="1" alignItems="center">
                    <Text>
                      {requisitData.validator &&
                        requisitData.validator.firstName}{" "}
                      {requisitData.validator &&
                        requisitData.validator.lastName}
                    </Text>
                    <Text>ผู้ตรวจสอบสินค้า</Text>
                  </VStack>
                </ScrollView>
                {requisitData.requisitionStatus == 2 && (
                  <>
                    <Divider mt="6" />
                    <HStack mx="4" mt="4" space={4}>
                      <VStack flex="2">
                        <Text mb="3" fontSize={16}>
                          ลงชื่อผู้ตรวจสอบสินค้า
                        </Text>
                        <Dropdown
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          fontFamily="Prompt-Regular"
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={empList}
                          search
                          dropdownPosition={
                            Platform.OS === "ios" ? "auto" : "bottom"
                          }
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="ลงชื่อผู้ตรวจสอบสินค้า"
                          searchPlaceholder="ค้นหา..."
                          value={validatorId}
                          onChange={(item) => {
                            setValidatorId(item.value);
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
                      </VStack>
                    </HStack>
                    <Button
                      mx="4"
                      colorScheme="emerald"
                      onPress={() => {
                        validateStatus();
                      }}
                    >
                      ยืนยันการทำรายการ
                    </Button>
                  </>
                )}
                <Collapse isOpen={error != ""}>
                  <Text
                    mx="4"
                    textAlign="center"
                    fontSize={18}
                    color="altred.400"
                  >
                    *{error}
                  </Text>
                </Collapse>
              </Modal.Body>
            </>
          )}
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default RequisitionDetail;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#f4f4f4",
    height: 50,
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexGrow: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
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
