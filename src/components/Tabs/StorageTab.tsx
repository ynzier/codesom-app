import {
  Box,
  Icon,
  Input,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  HStack,
  Text,
  Spacer,
} from "native-base";
import React from "react";
import { Animated, Platform } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface filterType {
  typeId: number;
  typeName: string;
}
const StorageTab = ({
  tabIndex,
  setTabIndex,
  keyword,
  setKeyword,
}: {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
  keyword: string;
  setKeyword: (k: string) => void;
}) => {
  const filterType = [
    { typeId: 1, typeName: "สินค้า" },
    { typeId: 2, typeName: "ส่วนผสม" },
    { typeId: 3, typeName: "อื่นๆ" },
  ];

  return (
    <HStack ml="2" mr="2" borderColor="#B4B4B4" mb="2">
      <Box
        alignItems="center"
        p="4"
        zIndex={2}
        flex="5"
        justifyContent="center"
      >
        <Input
          onChangeText={setKeyword}
          value={keyword}
          placeholder="ค้นหาด้วยชื่อ/รหัส"
          width="100%"
          borderRadius="4"
          py="3"
          px="1"
          height={{ md: 12, xl: 16 }}
          fontSize={{ md: "md", xl: "xl" }}
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          }
        />
      </Box>
      <Box
        flex="10"
        alignItems="center"
        justifyContent="flex-end"
        flexDirection="row"
      >
        {filterType.map((item: filterType) => {
          const borderColor = tabIndex == item.typeId ? "#9D7463" : "#CFCFCF";
          return (
            <Box
              key={item.typeId}
              alignItems="center"
              p="4"
              zIndex={2}
              width={{ md: 32, xl: 40 }}
              mx="1"
              backgroundColor={borderColor}
              borderRadius={12}
              borderBottomColor={borderColor}
            >
              <Pressable
                onPress={() => {
                  setKeyword("");
                  setTabIndex(item.typeId);
                }}
              >
                <Text
                  fontSize={{ md: "md", xl: "xl" }}
                  style={{
                    color: tabIndex == item.typeId ? "#fffdfa" : "#fffdfa",
                    fontFamily:
                      tabIndex == item.typeId
                        ? "Prompt-Medium"
                        : "Prompt-Regular",
                  }}
                >
                  {item.typeName}
                </Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    </HStack>
  );
};

export default StorageTab;
