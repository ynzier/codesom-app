import { Avatar, Text, FlatList, HStack, Box, VStack } from "native-base";
import React from "react";

type Props = {};

const MeneuList = (_props: Props) => {
  return (
    <>
      <HStack>
        <FlatList
          flex={1}
          numColumns={3}
          data={Array(16).fill("")}
          renderItem={(_item: any, i: React.Key | null | undefined) => (
            <Box
              key={i}
              h={{ md: 180, xl: 260 }}
              w={{ xl: 440 }}
              flexDirection="row"
              mx={4}
              my={2}
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                bg="purple.600"
                shadow={8}
                alignSelf="center"
                zIndex={2}
                position="absolute"
                left={0}
                size={{ md: 180, xl: 260 }}
                source={{
                  uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
                }}
              >
                RB
              </Avatar>
              <Box
                h={{ md: 100, xl: 160 }}
                w={{ md: 210, xl: 220 }}
                ml={{ md: 131, xl: 220 }}
                pl={{ md: 4 }}
                borderRadius={16}
                borderWidth={1}
                flexDirection="row"
              >
                <VStack
                  left={{ md: 80, xl: "20%" }}
                  w="80%"
                  justifyContent="center"
                  flexGrow={1}
                  fontSize={16}
                >
                  <Text fontWeight={200} fontSize={16} flexWrap="wrap">
                    ไอติมเบนยา ไอติมเบนยา ไอติมเบนยา ไอติมเบนยา ไอติมเบนยา
                  </Text>

                  <Text fontWeight={200} fontSize={16}>
                    200.00 บาท/ถ้วย
                  </Text>
                  <Text fontWeight={200} fontSize={16} color="#ABBBC2">
                    สินค้าคงเหลือ 2 ถ้วย
                  </Text>
                </VStack>
              </Box>
            </Box>
          )}
        />
      </HStack>
    </>
  );
};

export default MeneuList;
