import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar, Box, Center, HStack, VStack } from "native-base";
import { Navigation } from "../hooks/navigation";
import {
  StorageSidebar,
  StorageTab,
  StorageList,
  IngrList,
  StuffList,
} from "../components";
interface Props {
  navigation: Navigation;
  children?: JSX.Element;
}
const StorageScreen: React.FC<Props> = ({ navigation, children }) => {
  const [tabIndex, setTabIndex] = useState<number>(1);
  const [keyword, setKeyword] = useState("");

  useFocusEffect(
    useCallback(() => {
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
        return;
      });

      return () => {
        console.log("unmount");
      };
    }, [navigation])
  );

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
              <VStack w="100%" flex="10">
                <HStack h="20" w="100%" alignItems="center">
                  <StorageTab
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                    keyword={keyword}
                    setKeyword={setKeyword}
                  />
                </HStack>
                {tabIndex == 1 && <StorageList keyword={keyword} />}
                {tabIndex == 2 && <IngrList keyword={keyword} />}
                {tabIndex == 3 && <StuffList keyword={keyword} />}
              </VStack>
            </VStack>
          </VStack>

          {/*Sidebar Component */}
          <StorageSidebar />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default StorageScreen;
