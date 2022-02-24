import React, { useState, useEffect } from "react";
import { StatusBar, Box, Center, HStack, VStack } from "native-base";
import { Navigation } from "../hooks/navigation";
import { ReceiptSidebar } from "../components";
import branchService from "../services/branch.service";

interface Props {
  navigation: Navigation;
  children?: JSX.Element;
}
type IBranchObj = {
  brId: number;
  brName: string;
  brAddr: string;
  brTel: string;
  brStatus: string;
  brImg: string;
  image: {
    imgId: number;
    imgObj: string;
  };
};
const OrderScreen: React.FC<Props> = ({ navigation, children }) => {
  const [branchData, setBranchData] = useState<IBranchObj>({} as IBranchObj);

  useEffect(() => {
    let isSubscribed = true;
    branchService
      .getCurrentBranch()
      .then((res) => {
        if (isSubscribed) {
          setBranchData(res.data);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isSubscribed = false;
    };
  }, []);
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
              <HStack flex="1" alignItems="center"></HStack>
              <VStack w="100%" flex="10"></VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <ReceiptSidebar />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default OrderScreen;
