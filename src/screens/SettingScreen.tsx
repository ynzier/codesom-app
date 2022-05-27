import React, { useContext, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import {
  Text,
  Box,
  Center,
  HStack,
  VStack,
  FormControl,
  Button,
} from "native-base";
import { Navigation } from "../hooks/navigation";
import Constants from "expo-constants";
import { AuthContext } from "../context/AuthContext";
import { ReportSidebar } from "components";
import { TextInput } from "react-native-element-textinput";
import { orderService } from "services";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

export type Props = {
  navigation: Navigation;
  children: any;
};

const SettingScreen: React.FC<Props> = ({ children }) => {
  const { signOut } = useContext(AuthContext);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [cancelOrderErrorText, setCancelOrderErrorText] = useState<
    string | undefined
  >(undefined);
  const { promiseInProgress: canceling } = usePromiseTracker({
    area: "canceling",
  });

  const cancelOrder = async () => {
    if (orderId === undefined || orderId === "")
      return setCancelOrderErrorText("กรอกหมายเลขออเดอร์ก่อน");
    await trackPromise(
      new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve(
            orderService
              .cancelOrder(orderId)
              .then((res) =>
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: "ทำรายการสำเร็จ!",
                  textBody: res.data.message,
                })
              )
              .catch((error) => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                return setCancelOrderErrorText(resMessage);
              })
          );
        }, 1000);
      }),
      "canceling"
    );
  };
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box safeAreaTop bg="coolGray.500" />
      <Center flex="1" bg="#FFF">
        <HStack w="100%" flex="1">
          <VStack w="100%" flex={{ md: "3", xl: "4" }}>
            {children}
            <VStack
              w="95%"
              flex="10"
              alignSelf="center"
              alignItems="center"
              mt="4"
              mb="82px"
              justifyContent="center"
              fontFamily={"Prompt"}
            >
              <HStack w="100%" h="100%" flex="1">
                <VStack flex="1">
                  <Text textAlign={"center"} fontSize="md" fontWeight={"bold"}>
                    ยกเลิกออเดอร์
                  </Text>
                  <FormControl isInvalid={cancelOrderErrorText !== undefined}>
                    <FormControl.Label>
                      <Text fontFamily="Prompt-Medium">หมายเลขออเดอร์</Text>
                    </FormControl.Label>
                    <TextInput
                      value={orderId}
                      style={[styles.inputcontainer]}
                      inputStyle={styles.inputStyle}
                      placeholderStyle={styles.placeholderStyle}
                      iconStyle={styles.iconStyle}
                      placeholder="กรอกหมายเลขออเดอร์"
                      clearTextOnFocus
                      placeholderTextColor="gray"
                      onChangeText={(text) => {
                        setCancelOrderErrorText(undefined);
                        setOrderId(text);
                      }}
                    />
                    <FormControl.ErrorMessage>
                      * {cancelOrderErrorText}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <Button
                    colorScheme={"error"}
                    onPress={() => void cancelOrder()}
                    mt="3"
                    isLoading={canceling}
                    w="30%"
                    alignSelf="flex-end"
                  >
                    ดำเนินการ
                  </Button>
                </VStack>
                <HStack flex="1" />
              </HStack>
              <VStack flex="1" alignItems={"center"} justifyContent="flex-end">
                <Button colorScheme={"error"} onPress={signOut}>
                  ออกจากระบบ
                </Button>
                <Text>เวอร์ชัน: {Constants?.manifest?.version}</Text>
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <ReportSidebar />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  inputcontainer: {
    borderWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    justifyContent: "center",
    borderColor: "#e7e5e4",
    height: 40,
    borderRadius: 4,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "Prompt-Light",
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  inputStyle: { fontSize: 14, fontFamily: "Prompt-Light" },
});
