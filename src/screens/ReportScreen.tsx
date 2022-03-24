import React, { useContext, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import {
  Box,
  Text,
  Center,
  HStack,
  VStack,
  Spacer,
  ScrollView,
  Divider,
} from "native-base";
import { Navigation } from "../hooks/navigation";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import { DisabledSidebar } from "components";
import NumberFormat from "react-number-format";
import { reportService } from "services";
dayjs.extend(localizedFormat);
export type Props = {
  navigation: Navigation;
  children: any;
};

const ReportScreen: React.FC<Props> = ({ children }) => {
  const [topSale, setTopSale] = useState<any[]>([]);
  useEffect(() => {
    reportService
      .getTopSaleBranch()
      .then((res) => setTopSale(res.data))
      .catch((err) => console.log(err));

    return () => {};
  }, []);

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
              justifyContent={"center"}
              alignItems={"center"}
              mt="4"
              mb={{ md: "10%", xl: "6%" }}
            >
              <VStack
                w={{ md: "750", xl: "1000" }}
                h="525"
                alignItems={"center"}
                justifyContent="center"
                space={3}
              >
                <Box>
                  <Text fontSize={"xl"}>
                    รายงานประจำวันที่{" "}
                    {dayjs().locale("th").format("D MMMM YYYY ")}
                  </Text>
                </Box>
                <HStack flex="1" space={3}>
                  <VStack
                    borderWidth={1}
                    borderColor={"light.300"}
                    borderRadius={24}
                    flex="2"
                  >
                    <VStack
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={50}
                      borderBottomWidth={1}
                      borderColor={"light.300"}
                    >
                      <Text>รายงานยอดขาย</Text>
                    </VStack>
                    <HStack space="8" py="4">
                      <VStack
                        w="100%"
                        flex="1"
                        justifyContent={"center"}
                        pl="4"
                      >
                        <HStack>
                          <Text flex="2">เงินสด</Text>
                          <Text flex="1" textAlign={"center"}>
                            1
                          </Text>
                          <NumberFormat
                            value={500}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">Thai QR</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">อื่นๆ</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <Divider my="4" />
                        <HStack>
                          <Text flex="2">หน้าร้าน</Text>
                          <Text flex="1" textAlign={"center"}>
                            1
                          </Text>
                          <NumberFormat
                            value={500}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">Line Man</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">Robinhood</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">Grab</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">อื่นๆ</Text>
                          <Text flex="1" textAlign={"center"}>
                            0
                          </Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                      </VStack>
                      <Divider orientation="vertical" />
                      <VStack
                        w="100%"
                        flex="1"
                        justifyContent={"center"}
                        pr="4"
                      >
                        <HStack>
                          <Text flex="2">ยอดขาย</Text>
                          <Text flex="2" textAlign={"right"}>
                            500.00 บาท
                          </Text>
                        </HStack>
                        <HStack>
                          <Text flex="2">คืนเงิน</Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">ยอดค่าจัดส่ง</Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">ยอดรวม</Text>
                          <NumberFormat
                            value={500}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">VAT 7%</Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">ยอดรวม VAT</Text>
                          <NumberFormat
                            value={500}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <HStack>
                          <Text flex="2">ยกเลิกบิล</Text>
                          <NumberFormat
                            value={0}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                        <Divider my="4" />
                        <HStack>
                          <Text flex="2">ยอดขายสุทธิ</Text>
                          <NumberFormat
                            value={500}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale
                            renderText={(formattedValue) => (
                              <Text flex="2" textAlign={"right"}>
                                {formattedValue} บาท
                              </Text>
                            )}
                          />
                        </HStack>
                      </VStack>
                    </HStack>
                  </VStack>
                  <VStack
                    borderWidth={1}
                    borderColor={"light.300"}
                    borderRadius={24}
                    flex="1"
                  >
                    <VStack
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={50}
                      borderBottomWidth={1}
                    >
                      <Text>สินค้าขายดี</Text>
                    </VStack>
                    <ScrollView px="4" py="4">
                      {topSale.map((obj) => (
                        <HStack key={obj.productId}>
                          <Text flex="3" numberOfLines={1}>{obj.productName}</Text>
                          <Text flex="1" textAlign={"right"}>
                            {obj.totalCount}
                          </Text>
                        </HStack>
                      ))}
                    </ScrollView>
                  </VStack>
                </HStack>
              </VStack>
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

export default ReportScreen;
