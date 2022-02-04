import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, StatusBar } from "react-native";

import deviceStorage from "../services/deviceStorage";
import { Navigation } from "/hooks/navigation";
export type Props = {
  navigation: Navigation;
};

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(async () => {
    const test = await deviceStorage.loadJWT();
    console.log(test);
    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ alignSelf: "center" }}>Main Menu Screen</Text>
      <Text style={{ alignSelf: "center" }}>Current Token:</Text>
      <Text
        style={{ alignSelf: "center" }}
        onPress={() => {
          deviceStorage.deleteJWT();
          const test = deviceStorage.loadJWT();
          console.log(test);
          navigation.navigate("LogInScreen");
        }}
      >
        Back
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
});

export default MainMenuScreen;
