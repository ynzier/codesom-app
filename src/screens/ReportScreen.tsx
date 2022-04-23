import React, { useContext, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import {
  Box,
  Text,
  Center,
  HStack,
  VStack,
  ScrollView,
  Divider,
  Spinner,
} from "native-base";
import { Navigation } from "../hooks/navigation";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import "dayjs/locale/th"; // ES 2015
import { DisabledSidebar } from "components";
import NumberFormat from "react-number-format";
import { reportService } from "services";
dayjs.extend(localizedFormat);
export type Props = {
  navigation: Navigation;
  children: any;
};
type totalReport = {
  deliveryFare: number;
  subTotal: number;
  totalVat: number;
  finalTotal: number;
  paidCash: number;
  totalCash: number;
  paidQR: number;
  totalQR: number;
  takeAway: number;
  totalTakeAway: number;
  deliveryLineman: number;
  totalLineman: number;
  deliveryRobinhood: number;
  totalRobinhood: number;
  deliveryGrab: number;
  totalGrab: number;
  deliveryETC: number;
  totalETC: number;
  deliveryOff: number;
  totalOff: number;
};
const ReportScreen: React.FC<Props> = ({ children }) => {
  const { promiseInProgress } = usePromiseTracker();
  const [topSale, setTopSale] = useState<any[]>([]);
  const [totalReport, setTotalReport] = useState<totalReport>({
    deliveryFare: 0,
    subTotal: 0,
    totalVat: 0,
    finalTotal: 0,
    paidCash: 0,
    totalCash: 0,
    paidQR: 0,
    totalQR: 0,
    takeAway: 0,
    totalTakeAway: 0,
    deliveryLineman: 0,
    totalLineman: 0,
    deliveryRobinhood: 0,
    totalRobinhood: 0,
    deliveryGrab: 0,
    totalGrab: 0,
    deliveryETC: 0,
    totalETC: 0,
    deliveryOff: 0,
    totalOff: 0,
  });

  const fetchReport = () => {
    void trackPromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            reportService
              .getTopSaleBranch()
              .then((res) => setTopSale(res.data))
              .catch((err) => console.log(err))
          );

          resolve(
            reportService
              .getTodayReport()
              .then((res) => setTotalReport(res.data))
              .catch((err) => console.log(err))
          );
        }, 2000);
      })
    );
  };
  useEffect(() => {
    fetchReport();
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
                alignItems="center"
                justifyContent="center"
                space={3}
              >
                <Box flexDir={"row"} alignItems="center" mb="3">
                  <Text fontSize={"xl"} fontWeight={600}>
                    รายงานประจำวันที่{" "}
                    {dayjs().locale("th").format("D MMMM YYYY ")}
                  </Text>
                  <Ionicons
                    onPress={() => {
                      fetchReport();
                    }}
                    name="reload-circle-sharp"
                    size={24}
                    color="gray"
                  />
                </Box>
                {promiseInProgress ? (
                  <HStack flex="1" space={3}>
                    <Spinner size="sm" color="altred.500" />
                  </HStack>
                ) : (
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
                        <Text fontWeight={500} fontSize="lg">
                          รายงานยอดขาย
                        </Text>
                      </VStack>
                      <HStack space="6" py="4">
                        <VStack
                          w="100%"
                          flex="1"
                          justifyContent={"center"}
                          pl="4"
                        >
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              เงินสด
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.paidCash}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalCash}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              Thai QR
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.paidQR}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalQR}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <Divider my="4" />
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              หน้าร้าน
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.takeAway}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalTakeAway}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              Line Man
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.deliveryLineman}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalLineman}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              Robinhood
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.deliveryRobinhood}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalRobinhood}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              Grab
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.deliveryGrab}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalGrab}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              Line Official
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.deliveryOff}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalOff}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                          <HStack>
                            <Text flex="2" numberOfLines={1}>
                              อื่นๆ
                            </Text>
                            <Text flex="1" textAlign={"center"}>
                              {totalReport.deliveryETC}
                            </Text>
                            <NumberFormat
                              value={totalReport.totalETC}
                              displayType={"text"}
                              thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={(formattedValue) => (
                                <Text flex="3" textAlign={"right"}>
                                  {formattedValue} บาท
                                </Text>
                              )}
                            />
                          </HStack>
                        </VStack>
                        <Divider orientation="vertical" />
                        <VStack w="100%" flex="1" pr="4">
                          <HStack>
                            <Text flex="2">ยอดขาย</Text>
                            <NumberFormat
                              value={totalReport.subTotal}
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
                              value={totalReport.deliveryFare}
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
                              value={totalReport.totalVat}
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
                              value={totalReport.finalTotal}
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
                        borderColor={"light.300"}
                      >
                        <Text fontWeight={500} fontSize="lg">
                          สินค้าขายดี
                        </Text>
                      </VStack>
                      <ScrollView px="4" py="4">
                        {topSale.map((obj) => (
                          <HStack key={obj.productId}>
                            <Text flex="3" numberOfLines={1}>
                              {obj.productName}
                            </Text>
                            <Text flex="1" textAlign={"right"}>
                              {obj.totalCount}
                            </Text>
                          </HStack>
                        ))}
                      </ScrollView>
                    </VStack>
                  </HStack>
                )}
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
