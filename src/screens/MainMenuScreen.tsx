/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import { Alert, Dimensions } from "react-native";
import {
  StatusBar,
  Box,
  Center,
  HStack,
  VStack,
  FlatList,
  Text,
  View,
} from "native-base";
import EmployeeServices from "../services/employee.service";
import { Navigation } from "../hooks/navigation";
import Sidebar from "../components/Sidebar";
import axios, { AxiosError } from "axios";

interface Props {
  navigation: Navigation;
}

let { WIDTH } = Dimensions.get("window");
const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const [empData, setempData] = useState([]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
        return;
      }),
    [navigation]
  );

  useEffect(() => {
    async () => {
      await EmployeeServices.getAllEmployeeInBranch()
        .then((res) => {
          console.log(res.data);
          setempData(res.data);
        })
        .catch((error: AxiosError) => {
          const resMessage: string =
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
    };

    console.log("main screen");
    return () => {};
  }, []);
  type mockData = {
    prId: string;
    prName: string;
    prPrice: string;
    prCount: string;
  }[];
  interface IDataArray {
    prId: string;
    prName: string;
    prPrice: string;
    prCount: string;
  }
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
            <HStack w="100%" flex="3">
              <FlatList
                data={mockData}
                flex="1"
                numColumns={3}
                overScrollMode="never"
                ItemSeparatorComponent={() => <View w="16" bg="#FF99CC" />}
                renderItem={({ item }) => <Text>{item.prName}</Text>}
                keyExtractor={(item) => item.prId}
              />
            </HStack>
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
