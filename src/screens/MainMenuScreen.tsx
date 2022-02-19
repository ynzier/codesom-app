import React, { useState, useEffect } from "react";
import { Alert, Animated } from "react-native";
import {
  StatusBar,
  Box,
  Center,
  HStack,
  VStack,
  FlatList,
  Text,
  Skeleton,
  View,
  Badge,
  Button,
  ScrollView,
  Pressable,
} from "native-base";
import EmployeeServices from "../services/employee.service";
import { Navigation } from "../hooks/navigation";
import Sidebar from "../components/Sidebar";
import { AxiosError } from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductList from "../components/ProductList";
import { color } from "native-base/lib/typescript/theme/styled-system";

interface Props {
  navigation: Navigation;
}

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

  const mockData: {
    key: number;
    prId: string;
    prName: string;
    prPrice: string;
    prCount: string;
  }[] = [
    {
      key: 1,
      prId: "1",
      prName: "ไอติมเบนยา",
      prPrice: "200.00",
      prCount: "1",
    },
    { key: 2, prId: "2", prName: "เบนยาปั่น", prPrice: "210.00", prCount: "1" },
    {
      key: 3,
      prId: "22",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
      prCount: "1",
    },
    {
      key: 4,
      prId: "23",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
      prCount: "1",
    },
    {
      key: 5,
      prId: "245",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
      prCount: "1",
    },
    {
      key: 6,
      prId: "21",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
      prCount: "1",
    },
    {
      key: 7,
      prId: "26",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
      prCount: "1",
    },
    {
      key: 8,
      prId: "29",
      prName: "เบนยาปั่น",
      prPrice: "210.00",
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
            <HStack
              w="100%"
              flex="1"
              bg="browntheme.500"
              justifyContent="center"
              alignItems="center"
            >
              <HStack w="95%" justifyContent="center" alignItems="center">
                <Text
                  color="white"
                  flex="1"
                  fontSize={24}
                  fontFamily="body"
                  fontWeight={600}
                >
                  Codesom
                </Text>
                <Text
                  color="white"
                  fontSize={24}
                  fontFamily="body"
                  fontWeight={600}
                >
                  เซ็นทรัลปิ่นเกล้า
                </Text>
                <Skeleton
                  mx="4"
                  borderWidth={1}
                  borderColor="white"
                  endColor="warmGray.50"
                  size="12"
                  rounded="full"
                />
                <MaterialIcons
                  name="notifications"
                  color="white"
                  size={48}
                  style={{ transform: [{ rotate: "10deg" }] }}
                />
                <Badge // bg="red.400"
                  colorScheme="danger"
                  rounded="full"
                  mb={4}
                  ml="-12"
                  mr={8}
                  zIndex={1}
                  variant="solid"
                  _text={{
                    fontSize: 12,
                  }}
                  borderWidth="2"
                  borderColor="white"
                >
                  2
                </Badge>
              </HStack>
            </HStack>
            <VStack
              borderWidth={1}
              w="95%"
              borderRadius={5}
              flex="10"
              alignSelf="center"
              alignItems="center"
              mt="4"
              mb={{ md: "10%", xl: "6%" }}
              justifyContent="center"
            >
              <HStack flex="1" alignItems="center">
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                >
                  {[
                    "สินค้าขายดี",
                    "โปรโมชั่น",
                    "น้ำส้ม",
                    "เกล็ดหิมะ",
                    "ไอติม",
                  ].map((item, i) => {
                    const borderColor = "#000";
                    return (
                      <Box
                        key={i}
                        borderBottomWidth="3"
                        borderColor={borderColor}
                        alignItems="center"
                        p="3"
                      >
                        <Pressable
                          onPress={() => {
                            console.log(i);
                          }}
                        >
                          <Animated.Text
                            style={{
                              color: "#000",
                            }}
                          >
                            {item}
                          </Animated.Text>
                        </Pressable>
                      </Box>
                    );
                  })}
                </ScrollView>
              </HStack>
              <VStack flex="10" pr={2}>
                <ProductList />
              </VStack>
            </VStack>
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
