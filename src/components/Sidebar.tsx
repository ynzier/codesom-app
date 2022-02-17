import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Input,
  FlatList,
  Icon,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import IconCart from "./IconCart";
import Feather from "react-native-vector-icons/Feather";

type Props = { mockData: any };
interface IDataArray {
  key: number;
  prId: string;
  prName: string;
  prPrice: string;
  prCount: string;
}
const Sidebar = (props: Props) => {
  const [mockData, setMockData] = useState(props.mockData);
  const [sumAll, setSumAll] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [totalVat, setTotalVat] = useState("0");
  const [total, setTotal] = useState("0");

  useEffect(() => {
    const sum: number = mockData
      .map(
        (item: { prPrice: string; prCount: string }) =>
          parseFloat(item.prPrice) * parseInt(item.prCount)
      )
      .reduce((prev: any, curr: any) => prev + curr, 0)
      .toFixed(2);
    setSumAll(sum);
    const discount = 0.0;
    setTotalDiscount(discount.toFixed(2));
    const vat = (sum - discount) * 0.07;
    setTotalVat(vat.toFixed(2));
    setTotal((sum - discount + vat).toFixed(2));

    return () => {};
  }, [mockData]);

  const closeRow = (
    rowMap: { [x: string]: { closeRow: () => void } },
    rowKey: string | number
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...mockData];
    const prevIndex = mockData.findIndex(
      (item: { key: any }) => item.key === rowKey
    );
    newData.splice(prevIndex, 1);
    setMockData(newData);
  };

  const renderItem = (data: {
    item: { key: number; prName: string; prPrice: string; prCount: string };
    index: string | number;
  }) => (
    <Box
      borderWidth="0"
      borderRadius="18"
      bg="#97515F"
      px="5"
      py="2"
      mx="4"
      my="1"
    >
      <HStack space={3} justifyContent="center">
        <VStack w="100%" flex="6" mr="0">
          <Text
            fontFamily="mono"
            fontWeight={600}
            fontSize={{
              md: "lg",
              xl: "xl",
            }}
            color="#FFF"
            numberOfLines={1}
          >
            {data.item.prName}
          </Text>
          <Text
            fontFamily="mono"
            fontWeight={400}
            color="#FFF"
            numberOfLines={1}
          >
            {data.item.prPrice} บาท/รายการ
          </Text>
        </VStack>
        <Box
          flex="5"
          h="10"
          mt="1"
          justifyContent="center"
          borderWidth={1}
          borderRadius="24px"
          borderColor="#FFFDFA"
          alignItems="center"
          flexDirection="row"
        >
          <Box h="100%" flex="1" alignItems="center" justifyContent="center">
            <Pressable
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (parseInt(data.item.prCount) - 1 > 0) {
                  let temp = parseInt(data.item.prCount);
                  temp = temp - 1;

                  setMockData(
                    Object.values({
                      ...mockData,
                      [data.index]: {
                        ...mockData[data.index],
                        prCount: temp.toString(),
                      },
                    })
                  );
                }
              }}
            >
              <Text color="#FFF">-</Text>
            </Pressable>
          </Box>
          <Box
            h="100%"
            flex="2"
            borderLeftWidth={1}
            borderRightWidth={1}
            borderColor="#FFFDFA"
            alignSelf="center"
            justifyContent="center"
          >
            <Input
              keyboardType={Platform.OS === "ios" ? "phone-pad" : "numeric"}
              fontSize="14"
              textAlign="center"
              color="#FFF"
              alignSelf="center"
              borderWidth="0"
              value={data.item.prCount}
              onChangeText={(text) => {
                const onlyDigits = text.replace(/\D/g, "");
                const prCount = onlyDigits;

                setMockData(
                  Object.values({
                    ...mockData,
                    [data.index]: {
                      ...mockData[data.index],
                      prCount: prCount.toString(),
                    },
                  })
                );
              }}
            />
          </Box>
          <Box flex="1" h="100%" alignItems="center" justifyContent="center">
            <Pressable
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                let temp = parseInt(data.item.prCount);
                temp = temp + 1;
                setMockData(
                  Object.values({
                    ...mockData,
                    [data.index]: {
                      ...mockData[data.index],
                      prCount: temp.toString(),
                    },
                  })
                );
              }}
            >
              <Text color="#FFF">+</Text>
            </Pressable>
          </Box>
        </Box>
      </HStack>
    </Box>
  );

  const renderHiddenItem = (data: { item: { key: any } }, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Feather name="trash-2" color="#000" size={32} />
      </TouchableOpacity>
    </View>
  );
  return (
    <HStack w="100%" flex="1" bg="#FFF0D9">
      <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
        <Box
          flex="1"
          margin="0"
          w="100%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="48">รายการ</Text>
          <Text fontSize="48" marginLeft="10">
            {mockData.length}
          </Text>
        </Box>
        {/** Cart Item */}
        <Box flex="6" w="100%" h="100%" bg="#FFF0D9">
          <SwipeListView
            data={mockData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-60}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            keyExtractor={(item) => item.key}
          />
        </Box>
        <Box
          flex="2"
          w={{ md: "90%", xl: "80%" }}
          h="100%"
          bg="#FFF0D9"
          justifyContent="center"
        >
          <VStack>
            <HStack>
              <Text flex="1" textAlign="left" fontSize="18px" fontWeight={600}>
                ราคารวม
              </Text>
              <Text flex="2" textAlign="right" fontSize="18px" fontWeight={600}>
                {sumAll} บาท
              </Text>
            </HStack>
            <HStack>
              <Text flex="1" textAlign="left" fontSize="18px" fontWeight={600}>
                ส่วนลด
              </Text>
              <Text flex="2" textAlign="right" fontSize="18px" fontWeight={600}>
                {totalDiscount} บาท
              </Text>
            </HStack>
            <HStack>
              <Text flex="1" textAlign="left" fontSize="18px" fontWeight={600}>
                ภาษี 7%
              </Text>
              <Text flex="2" textAlign="right" fontSize="18px" fontWeight={600}>
                {totalVat} บาท
              </Text>
            </HStack>
            <HStack>
              <Text flex="1" textAlign="left" fontSize="18px" fontWeight={600}>
                ราคาสุทธิ
              </Text>
              <Text flex="2" textAlign="right" fontSize="18px" fontWeight={600}>
                {total} บาท
              </Text>
            </HStack>
          </VStack>
        </Box>
        <Box flex="1" w="100%" h="100%" bg="#FFF0D9">
          <Button
            borderRadius="xl"
            variant="solid"
            colorScheme="emerald"
            mx="4"
            size="md"
            _text={{ fontSize: 20, color: "#FFF" }}
            startIcon={<Icon as={IconCart} color="white" size={5} />}
          >
            ชำระเงิน
          </Button>
        </Box>
      </VStack>
    </HStack>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "red",
  },
  backRightBtnRight: {
    alignItems: "flex-end",
    backgroundColor: "red",
    borderRadius: 24,
    right: 16,
    paddingRight: 16,
  },
});

export default Sidebar;
