import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider, extendTheme, ToastProvider } from "native-base";
import { Root as AlertProvider } from "alert-toast-react-native";

import Login from "./src/screens/Login";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { authService, deviceStorage } from "services";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MainMenuScreen from "./src/screens/MainMenuScreen";
import OrderScreen from "./src/screens/OrderScreen";
import SecondScreen from "./src/screens/SecondScreen";
import StorageScreen from "./src/screens/StorageScreen";
import AppLoading from "expo-app-loading";
import useFonts from "./src/hooks/useFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";
import Topbar from "./src/components/Topbar";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = extendTheme({
  fontConfig: {
    Prompt: {
      200: {
        normal: "Prompt-ExtraLight",
      },
      300: {
        normal: "Prompt-Light",
      },
      400: {
        normal: "Prompt-Regular",
      },
      500: {
        normal: "Prompt-Medium",
      },
      600: {
        normal: "Prompt-SemiBold",
      },
      700: {
        normal: "Prompt-Bold",
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
      500: "#33A362",
      600: "#1e9150",
      700: "#126832",
      800: "#043f18",
      900: "#001702",
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Prompt",
    body: "Prompt",
    mono: "Prompt",
  },
});
interface Props {
  props: any;
}

const HomeTabs: React.FC<Props> = ({ props }) => {
  const window = useWindowDimensions();
  type ICartArray = {
    key: number;
    prId: string;
    prName: string;
    prPrice: string;
    prCount: number;
    [name: string]: any;
  };
  const [cartData, setCartData] = useState<ICartArray[]>([]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#9D7463",
        tabBarInactiveTintColor: "#CFCFCF",
        tabBarLabelStyle: {
          fontFamily: "Prompt-Regular",
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
        name="MainScreen"
        options={{
          tabBarLabel: "หน้าแรก",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {(props) => (
          <MainMenuScreen
            cartData={cartData}
            setCartData={setCartData}
            {...props}
          >
            <Topbar />
          </MainMenuScreen>
        )}
      </Tab.Screen>
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
        name="OrderScreen"
        options={{
          tabBarLabel: "ประวัติการขาย",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <OrderScreen {...props}>
            <Topbar />
          </OrderScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="DeliveryScreen"
        options={{
          tabBarLabel: "เดลิเวอรี่",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="delivery-dining" color={color} size={size} />
          ),
        }}
      >
        {(props) => (
          <MainMenuScreen
            cartData={cartData}
            setCartData={setCartData}
            {...props}
          >
            <Topbar />
          </MainMenuScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="StorageScreen"
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
      >
        {(props) => (
          <StorageScreen {...props}>
            <Topbar />
          </StorageScreen>
        )}
      </Tab.Screen>
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
  const LoadFonts = async () => {
    await useFonts();
    await authService
      .checkCurrentSession()
      .then((res) => {
        if (res) setSessionAvailable(true);
      })
      .catch(async (error) => {
        if (error) {
          await deviceStorage.deleteJWT();
          setSessionAvailable(false);
        }
      });
  };

  const [IsReady, SetIsReady] = useState(false);
  const [sessionAvailable, setSessionAvailable] = useState(false);

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
        <AlertProvider>
          <NativeBaseProvider theme={theme}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              {!sessionAvailable ? (
                <>
                  <Stack.Screen name="LogInScreen" component={Login} />
                  <Stack.Screen name="HomeScreen" component={HomeTabs} />
                </>
              ) : (
                <Stack.Screen name="HomeScreen" component={HomeTabs} />
              )}
            </Stack.Navigator>
          </NativeBaseProvider>
        </AlertProvider>
      </NavigationContainer>
    );
  }
};

export default App;
