import React, { useState, useEffect } from "react";
import {
  StatusBar,
  Box,
  Center,
  HStack,
  VStack,
  Text,
  Skeleton,
  Badge,
} from "native-base";
import { Navigation } from "../hooks/navigation";
import Sidebar from "../components/Sidebar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductList from "../components/ProductList";
import MainMenuTab from "../components/MainMenuTab";
import branchService from "../services/branch.service";

interface Props {
  navigation: Navigation;
}

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const [tabIndex, setTabIndex] = useState<number>(-1);
  const [branchData, setBranchData] = useState([]);
  useEffect(() => {
    navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      return;
    });
  }, [navigation]);

  useEffect(() => {
    branchService
      .getCurrentBranch()
      .then((res) => setBranchData(res.data))
      .catch((err) => console.log(err));
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
                  {branchData.brId} {branchData.brName}
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
                <MainMenuTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
              </HStack>
              <VStack w="100%" flex="10">
                <ProductList tabIndex={tabIndex} />
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
