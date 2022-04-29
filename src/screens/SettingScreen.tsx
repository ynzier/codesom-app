import React, { useContext } from "react";
import { Text, StatusBar, Dimensions } from "react-native";
import { Box, Center, HStack, VStack } from "native-base";
import { Navigation } from "../hooks/navigation";
import Constants from "expo-constants";
import { AuthContext } from "../context/AuthContext";
import { DisabledSidebar } from "components";
export type Props = {
  navigation: Navigation;
  children: any;
};

const SettingScreen: React.FC<Props> = ({ children }) => {
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
              mb="82px"
              justifyContent="center"
            >
              <Text onPress={signOut}>LOGOUT</Text>
              <Text>{Constants?.manifest?.version}</Text>
              <Text>
                {Dimensions.get("window").height}x
                {Dimensions.get("window").width}
              </Text>
              <Text>
                {Dimensions.get("screen").height}x
                {Dimensions.get("screen").width}
              </Text>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <DisabledSidebar />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default SettingScreen;
