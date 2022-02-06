import React, { useState, useEffect } from "react";
import { StyleSheet, StatusBar, Alert, FlatList, View } from "react-native";
import { NativeBaseProvider, Box, Center, Flex } from "native-base";
import EmployeeServices from "../services/employee.service";
import deviceStorage from "../services/deviceStorage";
import { Navigation } from "hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const [empData, setempData] = useState([]);
  useEffect(async () => {
    await EmployeeServices.getAllEmployeeInBranch()
      .then((res: array) => {
        console.log(res.data);
        setempData(res.data);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        Alert.alert("แจ้งเตือน", resMessage, [
          {
            text: "ยืนยัน",
            onPress: () => console.log("Cancel Pressed"),
            style: "destructive",
          },
        ]);
      });

    console.log("main screen");
    return () => {};
  }, []);
  return (
    <>
      <Box flex={1} bg="white" safeAreaTop width="100%" alignSelf="center">
        <Center>
          <Flex width="100%" direction="row">
            <Flex width="200" background="red"></Flex>
            <Flex width="100%" background="green"></Flex>
          </Flex>
        </Center>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default MainMenuScreen;
