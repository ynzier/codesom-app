import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  StatusBar,
  NativeBaseProvider,
  Box,
  Center,
  Flex,
  Stack,
  Text,
  HStack,
  VStack,
} from "native-base";
import EmployeeServices from "../services/employee.service";
import deviceStorage from "../services/deviceStorage";
import { Navigation } from "hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const [empData, setempData] = useState([]);
  useEffect(async () => {
    await EmployeeServices.getAllEmployeeInBranch()
      .then((res: array) => {
        console.log(res.data);
        setempData(res.data);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        Alert.alert("แจ้งเตือน", resMessage, [
          {
            text: "ยืนยัน",
            onPress: () => console.log("Cancel Pressed"),
            style: "destructive",
          },
        ]);
      });

    console.log("main screen");
    return () => {};
  }, []);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box safeAreaTop bg="coolGray.400" />
      <Center flex="1" bg="#F00">
        <HStack w="100%" flex="1" bg="#FFCC00">
          <HStack w="100%" flex="3" bg="#FF9CAA"></HStack>
          <HStack w="100%" flex="1" bg="#FFAA99">
            <VStack
              w="100%"
              flex="1"
              bg="#FF9CC0"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="48">จำนวน</Text>
              <Box flex="4" w="100%" h="100%" bg="#FFF" justifyContent="center">
                <Text fontSize="xl">ไอติมเบนยา</Text>
                <Text fontSize="xl">asd</Text>
                <Text fontSize="xl">asd</Text>
              </Box>
            </VStack>
          </HStack>
        </HStack>
      </Center>
    </>
  );
};

export default MainMenuScreen;
