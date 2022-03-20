import React, { useContext } from "react";
import { Text, StatusBar, View } from "react-native";
import { Box, Center, HStack, VStack } from "native-base";
import { Navigation } from "../hooks/navigation";
import { AuthContext } from "../context/AuthContext";
import { CartSidebar } from "components";
interface Props {
  navigation: Navigation;
  children?: JSX.Element;
  cartData?: any;
  setCartData: (value: any) => void;
}

const PromotionScreen: React.FC<Props> = ({
  cartData,
  setCartData,
  navigation,
  children,
}) => {
  const { signOut } = useContext(AuthContext);
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
              <Text
                onPress={() => {
                  signOut();
                }}
              >
                LOGOUT
              </Text>
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
