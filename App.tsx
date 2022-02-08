import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider, extendTheme } from "native-base";
import Login from "./screens/Login";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MainMenuScreen from "./screens/MainMenuScreen";
import SecondScreen from "./screens/SecondScreen";
import AppLoading from "expo-app-loading";
import useFonts from "./hooks/useFonts";
import deviceStorage from "./services/deviceStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = extendTheme({
  colors: { altred: "#97515F" },
  fontConfig: {
    Mitr: {
      100: {
        normal: "Mitr-Light",
      },
      200: {
        normal: "Mitr-Light",
      },
      300: {
        normal: "Mitr-Light",
        italic: "Roboto-LightItalic",
      },
      400: {
        normal: "Mitr-Regular",
      },
      500: {
        normal: "Mitr-Medium",
      },
      600: {
        normal: "Mitr-Medium",
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Mitr",
    body: "Mitr",
    mono: "Mitr",
  },
});

const HomeTabs: React.FC<Props> = ({ props }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ focused, route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "white",
        tabBarActiveBackgroundColor: "white",
        tabBarInactiveBackgroundColor: "#FFCB9B",
        tabBarLabelStyle: {
          fontFamily: "Mitr-Regular",
          fontSize: 14,
          marginBottom: 10,
        },
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          paddingTop: 0,
          marginTop: 0,
          borderTopWidth: 0,
          backgroundColor: "#ff9c00",
          height: 80,
        },
        tabBarItemStyle: {
          elevation: 5,
        },
      })}
    >
      <Tab.Screen
        name="MainMenuScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "หน้าแรก",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PromotionScreen"
        component={SecondScreen}
        options={{
          tabBarLabel: "โปรโมชั่น",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="percent" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CategorieScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "หมวดหมู่",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DeliveryScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "เดลิเวอรี่",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="delivery-dining" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="StockScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "คลังวัตถุดิบ",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="warehouse"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "รายงาน",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={MainMenuScreen}
        options={{
          tabBarLabel: "ตั้งค่า",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const App: React.FC<Props> = () => {
  const [accessToken, setAccessToken] = useState("");

  const LoadFonts = async () => {
    await useFonts();
  };

  useEffect(async () => {
    await AsyncStorage.getItem("accessToken", (error: any, result: any) => {
      if (result) {
        setAccessToken(result);
      } else {
        console.log("error1:", JSON.stringify(error));
        return;
      }
    });

    return () => {};
  }, [accessToken]);

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
        <NativeBaseProvider theme={theme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="LogInScreen" component={Login} />
            <Stack.Screen name="HomeScreen" component={HomeTabs} />
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    );
  }
};

export default App;
