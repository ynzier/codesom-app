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
  KeyboardAvoidingView,
  FlatList,
  VStack,
  Skeleton,
  Avatar,
  Spacer,
  ScrollView,
} from "native-base";
import EmployeeServices from "../services/employee.service";
import deviceStorage from "../services/deviceStorage";
import { Navigation } from "hooks/navigation";
import Sidebar from "../components/Sidebar";
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
  type mockData = {
    prId: string;
    prName: string;
    prPrice: number;
    prCount: number;
  };
  const mockData: mockData = [
    { prId: "1", prName: "ไอติมเบนยา", prPrice: "200.00", prCount: "1" },
    { prId: "2", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "22", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "23", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "245", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "21", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "26", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "29", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    { prId: "27", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    {
      prId: "3",
      prName: "น้ำส้มเบนยาาาาาาาา",
      prPrice: "200.00",
      prCount: "1",
    },
  ];

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box safeAreaTop bg="coolGray.400" />
      <Center flex="1" bg="#FFF">
        <HStack w="100%" flex="1">
          <VStack w="100%" flex={{ md: "3", xl: "4" }}>
            <HStack w="100%" flex="1" bg="#F00"></HStack>
            <HStack w="100%" flex="3"></HStack>
          </VStack>

          {/*Sidebar Component */}
          <Sidebar mockData={mockData} />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default MainMenuScreen;
