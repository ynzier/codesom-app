import React, { useState } from "react";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Icon,
  Divider,
  FlatList,
} from "native-base";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconCart from "../IconCart";
import AlertToast from "../AlertToast";
import CheckOutModal from "../CheckOutModal";

type Props = {
  cartData: any;
  setCartData: (value: any) => void;
};

const ReceiptSidebar = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [sumAll, setSumAll] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [totalVat, setTotalVat] = useState("0");
  const [total, setTotal] = useState("0");

  return (
    <>
      <CheckOutModal showModal={showModal} setShowModal={setShowModal} />
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
            <Text fontSize={{ md: 36, xl: 48 }}>สรุปรายการ</Text>
          </Box>
          {/** Cart Item */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box
            flex="8"
            w={{ md: "90%", xl: "80%" }}
            h="100%"
            bg="#FFFDFA"
            borderWidth={1}
            mb="4"
          >
            <Text
              my="2"
              alignSelf="center"
              fontSize={{
                md: "24",
                xl: "xl",
              }}
            >
              ใบเสร็จ
            </Text>
            <Divider thickness="1" mb={4} bg="black" />
            <VStack flex="5" px="4">
              <HStack flex="1" mb="2">
                <Text flex="5" fontSize={16}>
                  รายการ
                </Text>
                <Text flex="2" textAlign="right" fontSize={16}>
                  จำนวน
                </Text>
                <Text flex="3" ml="2" textAlign="right" fontSize={16}>
                  บาท/หน่วย
                </Text>
              </HStack>
              <VStack flex="8">
                <FlatList
                  data={[
                    {
                      key: 1,
                      prName: "ไอติมเบนยา",
                      prCount: 8,
                      prPrice: 200.0,
                    },
                    {
                      key: 2,
                      prName: "ขนมไมโล",
                      prCount: 1,
                      prPrice: 100.0,
                    },
                    {
                      key: 3,
                      prName: "น้ำกะทิเบนยา",
                      prCount: 3,
                      prPrice: 32.02,
                    },
                    {
                      key: 4,
                      prName: "น้ำส้มเกล็ดหิมะ",
                      prCount: 4,
                      prPrice: 39.0,
                    },
                  ]}
                  keyExtractor={(item: any) => item.key}
                  renderItem={(data: {
                    item: {
                      key: number;
                      prName: string;
                      prPrice: number;
                      prCount: number;
                    };
                    index: string | number;
                  }) => (
                    <Box mb="2" w="100%" flexDirection="row">
                      <Text flex="5" fontSize={16} noOfLines={2}>
                        • {data.item.prName}
                      </Text>
                      <Text textAlign="right" flex="2" fontSize={16}>
                        {data.item.prCount}
                      </Text>
                      <Text flex="3" ml="2" textAlign="right" fontSize={16}>
                        {data.item.prPrice.toFixed(2)}
                      </Text>
                    </Box>
                  )}
                />
              </VStack>
            </VStack>
            <Divider
              thickness="1"
              mb={4}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <VStack flex="2" px="4">
              <HStack>
                <Text flex="1" textAlign="left" fontSize="18px">
                  ราคารวม
                </Text>
                <Text flex="2" textAlign="right" fontSize="18px">
                  {sumAll || 0} บาท
                </Text>
              </HStack>
              <HStack>
                <Text flex="1" textAlign="left" fontSize="18px">
                  ส่วนลด
                </Text>
                <Text flex="2" textAlign="right" fontSize="18px">
                  {totalDiscount || 0} บาท
                </Text>
              </HStack>
              <HStack>
                <Text flex="1" textAlign="left" fontSize="18px">
                  ภาษี 7%
                </Text>
                <Text flex="2" textAlign="right" fontSize="18px">
                  {totalVat || 0} บาท
                </Text>
              </HStack>
            </VStack>
            <Divider
              thickness="1"
              mb={4}
              mt={2}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <HStack flex="1" px="4">
              <Text flex="1" textAlign="left" fontSize="20" fontWeight={600}>
                ราคาสุทธิ
              </Text>
              <Text flex="2" textAlign="right" fontSize="20" fontWeight={600}>
                {total || 0} บาท
              </Text>
            </HStack>
            <Divider
              thickness="1"
              mb={4}
              w="5/6"
              alignSelf="center"
              bg="gray.300"
            />
            <VStack flex="2.2" mb="4">
              <HStack flex="1" px="4" mb="2">
                <Text fontSize="18px" fontWeight={600}>
                  เลือกวิธีการชำระเงิน
                </Text>
              </HStack>
              <HStack px="4" space={2}>
                <Pressable
                  w="70px"
                  h="70px"
                  borderRadius={100}
                  borderWidth={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name="cash-outline" size={24} color="black" />
                  <Text>เงินสด</Text>
                </Pressable>
                <Pressable
                  w="70px"
                  h="70px"
                  borderRadius={100}
                  borderWidth={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name="qr-code-outline" size={24} color="black" />
                  <Text>เงินสด</Text>
                </Pressable>
              </HStack>
            </VStack>
          </Box>
          <Box
            flex="1"
            w="100%"
            h="100%"
            bg="#FFF0D9"
            px="4"
            alignItems="center"
          >
            <Button
              borderRadius="xl"
              colorScheme="greenalt"
              mx="4"
              w="100%"
              h="75%"
              _text={{ fontSize: 20, color: "white" }}
              startIcon={<Icon as={IconCart} size={5} />}
              onPress={() => {
                AlertToast("Hi, Nice to see you ( ´ ∀ ` )ﾉ", "success");
                setShowModal(true);
              }}
            >
              ชำระเงิน
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};
const styles = StyleSheet.create({
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

export default ReceiptSidebar;
