/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  FlatList,
  Spinner,
} from "native-base";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { lalamoveService } from "services";

dayjs.extend(localizedFormat);

const DeliverySidebar = ({
  itemId,
  handleClose,
}: {
  itemId: string | undefined;
  handleClose: () => void;
}) => {
  const [itemList, setItemList] = useState<any[]>([]);
  const { promiseInProgress: loadingDeliverySidebar } = usePromiseTracker({
    area: "loadingDeliverySidebar",
  });
  useEffect(() => {
    if (itemId) {
      void trackPromise(
        lalamoveService
          .getOrderItemApp(itemId)
          .then((res) => setItemList(res.data.order_items))
          .catch((err) => console.log(err)),
        "loadingDeliverySidebar"
      );
    }

    return () => {
      setItemList([]);
    };
  }, [itemId]);

  return !itemId ? (
    <>
      <HStack
        w="100%"
        flex="1"
        bg="#FFF0D9"
        opacity={0.5}
        justifyContent="center"
        alignItems="center"
        flexDirection={"column"}
      >
        <Text fontSize={24}>แตะ &#39;&#39;ดูสินค้า&#39;&#39;</Text>
        <Text fontSize={24}>เพื่อแสดงรายการ</Text>
      </HStack>
    </>
  ) : (
    <>
      <HStack w="100%" flex="1" bg="#FFF0D9" justifyContent="center">
        <VStack w="100%" justifyContent="center" p={4}>
          <VStack bg="white" borderWidth={1} h={"100%"} w="100%" p={4}>
            <Text fontSize={"xl"} color="darkText">
              ออเดอร์ #{itemId}
            </Text>
            <Text fontSize={"xl"} color="darkText" mb="2">
              รายการสินค้า
            </Text>
            {loadingDeliverySidebar ? (
              <Spinner size={"lg"} color="cream" />
            ) : (
              <FlatList
                data={itemList}
                keyExtractor={(item: any) => item.productId.toString()}
                renderItem={(data: any) => (
                  <Box mb="2" w="100%" flexDirection="row">
                    <Text flex="5" fontSize={{ md: 16, xl: 20 }} noOfLines={2}>
                      • {data.item.product.productName}
                    </Text>
                    <Text
                      textAlign="right"
                      flex="2"
                      fontSize={{ md: 16, xl: 20 }}
                    >
                      {data.item.quantity} {data.item.product.productUnit}
                    </Text>
                  </Box>
                )}
              />
            )}
            <Button
              variant="subtle"
              colorScheme={"amber"}
              onPress={handleClose}
            >
              ปิด
            </Button>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
};

export default DeliverySidebar;
