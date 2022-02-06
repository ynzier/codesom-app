import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  FlatList,
  View,
} from "react-native";
import { NativeBaseProvider, Box, Center } from "native-base";
import EmployeeServices from "../services/employee.service";
import deviceStorage from "../services/deviceStorage";
import { Navigation } from "hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const SecondScreen: React.FC<Props> = ({ props, navigation }) => {
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
        <StatusBar barStyle="light-content" />
        <Center style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                alignContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ flex: 1 }}>Menu</Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>SecondScreen</Text>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
          <FlatList
            data={empData}
            renderItem={({ item }) => (
              <Text style={styles.item}>
                {item.emp_id} {item.first_name}
              </Text>
            )}
            keyExtractor={(item) => item.emp_id}
          />
          <Text
            style={{ alignSelf: "center" }}
            onPress={() => {
              deviceStorage.deleteJWT();
              navigation.navigate("LogInScreen");
            }}
          >
            Back
          </Text>
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

export default SecondScreen;
