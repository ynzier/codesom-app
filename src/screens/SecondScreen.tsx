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
import { Navigation } from "../hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const SecondScreen: React.FC<Props> = ({ navigation }) => {
  const [empData, setempData] = useState([]);

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
