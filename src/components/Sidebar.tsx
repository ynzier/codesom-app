import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  FlatList,
  Pressable,
  Button,
  VStack,
  Skeleton,
  Input,
  Icon,
} from "native-base";
import { Platform } from "react-native";
import IconCart from "./IconCart";

type Props = { mockData: any };
interface IDataArray {
  prId: string;
  prName: string;
  prPrice: string;
  prCount: string;
}
const Sidebar = (props: Props) => {
  const [data, setData] = useState(props.mockData);
  const [sumAll, setSumAll] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [totalVat, setTotalVat] = useState("0");
  const [total, setTotal] = useState("0");
  useEffect(() => {
    const sum: number = data
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
  }, [data]);

  return (
    <HStack w="100%" flex="1">
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
            {data.length}
          </Text>
        </Box>
        {/** Cart Item */}
        <Box flex="6" w="100%" h="100%" bg="#FFF">
          <FlatList
            data={data}
            flex="1"
            overScrollMode="never"
            renderItem={({
              item,
              index,
            }: {
              item: IDataArray;
              index: number;
            }) => (
              <Box
                borderWidth="1"
                borderRadius="24"
                borderColor="coolGray.200"
                pl="3"
                pr="4"
                py="2"
                mx="4"
                my="1"
              >
                <HStack space={3} justifyContent="center">
                  <Skeleton mt="1" flex={{ md: 3, xl: 2 }} rounded="full" />
                  <VStack w="100%" flex="6" mr="0">
                    <Text
                      fontFamily="mono"
                      fontWeight={600}
                      fontSize={{
                        md: "lg",
                        xl: "xl",
                      }}
                      color="coolGray.800"
                      numberOfLines={1}
                    >
                      {item.prName}
                    </Text>
                    <Text
                      fontFamily="mono"
                      fontWeight={400}
                      color="coolGray.600"
                      numberOfLines={1}
                    >
                      {item.prPrice} บาท/รายการ
                    </Text>
                  </VStack>
                  <Box
                    flex="6"
                    h="12"
                    borderRightRadius="lg"
                    borderLeftRadius="xl"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                  >
                    <Box
                      bg="#FFF"
                      flex="2"
                      h="80%"
                      borderLeftRadius="lg"
                      borderTopWidth="1"
                      borderLeftWidth="1"
                      borderBottomWidth="1"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Pressable
                        onPress={() => {
                          if (parseInt(item.prCount) - 1 > 0) {
                            let temp = parseInt(item.prCount);
                            temp = temp - 1;
                            setData(
                              Object.values({
                                ...data,
                                [index]: {
                                  ...data[index],
                                  prCount: temp.toString(),
                                },
                              })
                            );
                          }
                        }}
                      >
                        <Text>-</Text>
                      </Pressable>
                    </Box>
                    <Box
                      h="100%"
                      flex="5"
                      borderWidth="2"
                      borderRadius="8"
                      alignSelf="center"
                      justifyContent="center"
                    >
                      <Input
                        keyboardType={
                          Platform.OS === "ios" ? "phone-pad" : "numeric"
                        }
                        fontSize="14"
                        textAlign="center"
                        alignSelf="center"
                        borderWidth="0"
                        value={item.prCount}
                        onChangeText={(text) => {
                          const onlyDigits = text.replace(/\D/g, "");
                          item.prCount = onlyDigits;

                          setData(
                            Object.values({
                              ...data,
                              [index]: {
                                ...data[index],
                                prCount: item.prCount,
                              },
                            })
                          );
                        }}
                      />
                    </Box>
                    <Box
                      flex="2"
                      h="80%"
                      borderRightRadius="lg"
                      borderRightWidth="1"
                      borderTopWidth="1"
                      borderBottomWidth="1"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Pressable
                        onPress={() => {
                          let temp = parseInt(item.prCount);
                          temp = temp + 1;
                          setData(
                            Object.values({
                              ...data,
                              [index]: {
                                ...data[index],
                                prCount: temp.toString(),
                              },
                            })
                          );
                        }}
                      >
                        <Text>+</Text>
                      </Pressable>
                    </Box>
                  </Box>
                </HStack>
              </Box>
            )}
            keyExtractor={(item) => item.prId}
          />
        </Box>
        <Box
          flex="2"
          w={{ md: "90%", xl: "80%" }}
          h="100%"
          bg="#FFF"
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
        <Box flex="1" w="100%" h="100%" bg="#FFF">
          <Button
            borderRadius="xl"
            variant="outline"
            borderColor="#FF9C00"
            mx="4"
            _text={{ fontSize: 20, color: "#FF9C00" }}
            startIcon={<Icon as={IconCart} name="email" size={5} />}
          >
            จ่ายตัง
          </Button>
        </Box>
      </VStack>
    </HStack>
  );
};

export default Sidebar;
