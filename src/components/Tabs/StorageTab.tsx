import { Box, Icon, Pressable, HStack, Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-element-textinput";
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
    <HStack borderColor="#B4B4B4" mb="2" mx="4">
      <Box alignItems="center" py="4" zIndex={2} justifyContent="center">
        <TextInput
          value={keyword}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          label="ค้นหา"
          placeholderTextColor="gray"
          onChangeText={setKeyword}
          renderLeftIcon={() => (
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          )}
        />
      </Box>
      <Box
        flex="1"
        alignItems="center"
        justifyContent="flex-end"
        flexDirection="row"
      >
        {filterType.map((item: filterType) => {
          const borderColor = tabIndex == item.typeId ? "#9D7463" : "#CFCFCF";
          return (
            <Pressable
              key={item.typeId}
              onPress={() => {
                setKeyword("");
                setTabIndex(item.typeId);
              }}
            >
              <Box
                alignItems="center"
                p="4"
                zIndex={2}
                width={24}
                mx="1"
                backgroundColor={borderColor}
                borderRadius={12}
                borderBottomColor={borderColor}
              >
                <Text
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
              </Box>
            </Pressable>
          );
        })}
      </Box>
    </HStack>
  );
};

export default StorageTab;

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 400,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#d1d5db",
  },
  inputStyle: { fontFamily: "Prompt-Regular", letterSpacing: 1 },
  labelStyle: {
    color: "#9ca3af",
    position: "absolute",
    top: -10,
    backgroundColor: "#FFFDFA",
    paddingHorizontal: 4,
    marginLeft: -4,
    fontFamily: "Prompt-Regular",
  },
  placeholderStyle: {
    color: "#9ca3af",
    fontFamily: "Prompt-Regular",
    letterSpacing: 1,
  },
});
