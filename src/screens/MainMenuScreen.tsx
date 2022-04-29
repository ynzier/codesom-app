import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar, Box, Center, HStack, VStack } from "native-base";
import { Navigation } from "../hooks/navigation";
import { CartSidebar, MainMenuTab, ProductList } from "components";

interface Props {
  navigation: Navigation;
  children?: JSX.Element;
  cartData?: any;
  setCartData: (value: any) => void;
  promoCart?: any;
  setPromoCart: (value: any) => void;
}
const MainMenuScreen: React.FC<Props> = ({
  cartData,
  setCartData,
  navigation,
  children,
  promoCart,
  setPromoCart,
}) => {
  const [tabIndex, setTabIndex] = useState<number>(-1);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      return;
    });
  }, [navigation]);

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
              marginBottom={"82px"}
              justifyContent="center"
            >
              <HStack mt="2" alignItems="center">
                <MainMenuTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
              </HStack>
              <VStack w="100%" flex="10">
                <ProductList
                  cartData={cartData}
                  setCartData={setCartData}
                  tabIndex={tabIndex}
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

export default MainMenuScreen;
