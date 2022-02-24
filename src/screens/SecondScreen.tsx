import React, {  } from "react";
import {
  Text,
  StatusBar,
  View,
} from "react-native";
import { Box, Center } from "native-base";
import { Navigation } from "../hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const SecondScreen: React.FC<Props> = () => {

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


export default SecondScreen;
