import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "./screen/LogInScreen";
import AppLoading from "expo-app-loading";
import useFonts from "./hooks/useFonts";
const Stack = createNativeStackNavigator();

const App: React.FC<Props> = () => {
  const LoadFonts = async () => {
    await useFonts();
  };
  const [IsReady, SetIsReady] = useState(false);
  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => {
          console.log("load done");
          SetIsReady(true);
        }}
        onError={() => {}}
      />
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="LogInScreen"
            component={LogInScreen}
            options={{ title: "Welcome" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
