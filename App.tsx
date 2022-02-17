import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider, extendTheme } from "native-base";
import Login from "./src/screens/Login";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MainMenuScreen from "./src/screens/MainMenuScreen";
import SecondScreen from "./src/screens/SecondScreen";
import AppLoading from "expo-app-loading";
import useFonts from "./src/hooks/useFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = extendTheme({
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
  colors: {
    cream: "#F9DCC2",
    browntheme: {
      50: "#ffebe6",
      100: "#e6d1cc",
      200: "#d0b6af",
      300: "#bb9b90",
      400: "#a68172",
      500: "#8d6559",
      600: "#6f4b44",
      700: "#50332f",
      800: "#321c1b",
      900: "#190100",
    },
    altred: {
      50: "#ffeaf4",
      100: "#e9cbd6",
      200: "#d5abb8",
      300: "#c28a9a",
      400: "#af6a79",
      500: "#95505e",
      600: "#753d4d",
      700: "#552c39",
      800: "#351924",
      900: "#1a040d",
    },
    greenalt: {
      50: "#e0fdea",
      100: "#bcf2cf",
      200: "#94e8b5",
      300: "#6cde9d",
      400: "#44d486",
      500: "#2bbb71",
      600: "#1e9150",
      700: "#126832",
      800: "#043f18",
      900: "#001702",
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Mitr",
    body: "Mitr",
    mono: "Mitr",
  },
});
interface Props {
  props: any;
}
const HomeTabs: React.FC<Props> = ({ props }) => {
  const window = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#9D7463",
        tabBarInactiveTintColor: "#CFCFCF",
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
          backgroundColor: "white",
          height: 80,
          width: "auto",
          paddingHorizontal: window.width < 1280 ? "10%" : "20%",
          marginRight: window.width < 1280 ? "25%" : "20%",
          position: "absolute",
          elevation: 0,
        },
      })}
      backBehavior="none"
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
          tabBarLabel: "ประเภท",
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

  useEffect(() => {
    async () => {
      await AsyncStorage.getItem("accessToken", (error: any, result: any) => {
        if (result) {
          setAccessToken(result);
        } else {
          console.log("error1:", JSON.stringify(error));
          return;
        }
      });
    };

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
