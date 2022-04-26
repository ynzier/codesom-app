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
  RequisitionModal,
  RequisitionDetail,
} from "../components";
import { requisitionService } from "services";
interface Props {
  navigation: Navigation;
  children?: JSX.Element;
}
const StorageScreen: React.FC<Props> = ({ navigation, children }) => {
  const [tabIndex, setTabIndex] = useState<number>(1);
  const [keyword, setKeyword] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const [reqId, setReqId] = useState<number | undefined>(undefined);
  const handleShowDetail = (id: number | undefined) => {
    setShowDetail((s) => !s);
    setReqId(id);
  };
  const handleShowRequest = () => {
    setShowRequest((s) => !s);
  };
  const handleFetch = () => {
    void fecthHistory(true);
  };
  const fecthHistory = useCallback(async (isSubscribed?: boolean) => {
    await requisitionService
      .listReqApp()
      .then((res) => {
        const temp = res.data;
        if (isSubscribed) setListData(temp);
      })
      .catch((error) => console.log(error));
  }, []);
  useFocusEffect(
    useCallback(() => {
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
        return;
      });

      return () => {};
    }, [navigation])
  );
  useEffect(() => {
    const abortController = new AbortController();
    void (async function fetchData() {
      try {
        const response = await requisitionService.listReqApp();
        setListData(response.data);
      } catch (error) {
        console.log("error", error);
      }
    })();

    return () => {
      abortController.abort();
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
      {showRequest && (
        <RequisitionModal
          showRequest={showRequest}
          setShowRequest={setShowRequest}
        />
      )}
      {showDetail && (
        <RequisitionDetail
          showDetail={showDetail}
          setShowDetail={setShowDetail}
          reqId={reqId}
        />
      )}
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
          <StorageSidebar
            listData={listData}
            handleShowRequest={handleShowRequest}
            handleShowDetail={handleShowDetail}
            handleFetch={handleFetch}
          />
          {/*Sidebar Component */}
        </HStack>
      </Center>
    </>
  );
};

export default StorageScreen;
