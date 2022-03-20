import React, { useContext } from "react";
import { StatusBar, View } from "react-native";
import { Box, Center, HStack, VStack, Text } from "native-base";
import { Navigation } from "../hooks/navigation";
import { CartSidebar, PromotionList } from "components";
interface Props {
  navigation: Navigation;
  children?: JSX.Element;
  cartData?: any;
  setCartData: (value: any) => void;
}

const PromotionScreen: React.FC<Props> = ({
  cartData,
  setCartData,
  children,
}) => {
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
              mb={{ md: "10%", xl: "6%" }}
              justifyContent="center"
            >
              <HStack
                w="100%"
                flex="1"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xl">โปรโมชัน</Text>
              </HStack>
              <VStack
                w="100%"
                flex="12"
                px={4}
                py={2}
                borderWidth={1}
                borderRadius={5}
              >
                <PromotionList
                  cartData={cartData}
                  setCartData={setCartData}
                />
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <CartSidebar cartData={cartData} setCartData={setCartData} />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default PromotionScreen;
