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
  promoCart?: any;
  setPromoCart: (value: any) => void;
}

const PromotionScreen: React.FC<Props> = ({
  cartData,
  setCartData,
  promoCart,
  setPromoCart,
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
              w="100%"
              flex="10"
              alignSelf="center"
              alignItems="center"
              mt="4"
              marginBottom={"82px"}
              justifyContent="center"
            >
              <HStack w="100%" alignItems="center" justifyContent="center">
                <Text fontSize="xl" fontWeight={500}>
                  โปรโมชัน
                </Text>
              </HStack>
              <VStack w="100%" flex="12">
                <PromotionList
                  cartData={cartData}
                  setCartData={setCartData}
                  promoCart={promoCart}
                  setPromoCart={setPromoCart}
                />
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <CartSidebar
            cartData={cartData}
            setCartData={setCartData}
            promoCart={promoCart}
            setPromoCart={setPromoCart}
          />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default PromotionScreen;
