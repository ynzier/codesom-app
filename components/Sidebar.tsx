import React, { useState } from "react";
import {
  Box,
  Center,
  Flex,
  Stack,
  Text,
  HStack,
  FlatList,
  Pressable,
  VStack,
  Skeleton,
  Spacer,
  Input,
} from "native-base";

type Props = { mockData: any };

const Sidebar = (props: Props) => {
  const [data, setData] = useState(props.mockData);

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
            renderItem={({ item, index }) => (
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
                <HStack space={3} justifyContent="space-between">
                  <Skeleton flex="3" rounded="full" />
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
                      borderTopWidth="2"
                      borderLeftWidth="2"
                      borderBottomWidth="2"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Pressable
                        onPress={() => {
                          if (item.prCount - 1 > 0) {
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
                      borderWidth="1"
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
                      bg="#F00"
                      flex="2"
                      h="80%"
                      borderRightRadius="lg"
                      borderRightWidth="2"
                      borderTopWidth="2"
                      borderBottomWidth="2"
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
        <Box flex="2" w="100%" h="100%" bg="#FFF"></Box>
        <Box flex="1" w="100%" h="100%" bg="#FFF"></Box>
      </VStack>
    </HStack>
  );
};

export default Sidebar;
