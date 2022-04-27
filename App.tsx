import React, { useState, useEffect, useReducer, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider, extendTheme, Badge, VStack } from "native-base";
import { Root as AlertProvider } from "alert-toast-react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { authService, lalamoveService, deviceStorage } from "services";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  LoginScreen,
  MainMenuScreen,
  OrderScreen,
  PromotionScreen,
  StorageScreen,
  SettingScreen,
  ReportScreen,
  DeliveryScreen,
} from "./src/screens";
import AppLoading from "expo-app-loading";
import useFonts from "./src/hooks/useFonts";
import { useWindowDimensions } from "react-native";
import Topbar from "./src/components/Topbar";
import http from "./src/http-common";
import { AuthContext } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface AccessToken {
  accessToken: string;
}

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        lineHeight: { lg: "xl" },
        fontSize: {
          lg: 14,
          xl: 18,
        },
      },
    },
  },

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
    productId: string;
    productName: string;
    productPrice: string;
    quantity: number;
    [name: string]: any;
  };
  const [cartData, setCartData] = useState<ICartArray[]>([]);
  const [promoCart, setPromoCart] = useState<any[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const notifCheck = setInterval(() => {
      void lalamoveService
        .getAppNotifCount()
        .then((res) => setNotifCount(res.data.waitingCount))
        .catch((err) => console.log(err.message));
    }, 30000);
    return () => {
      clearInterval(notifCheck);
    };
  }, []);

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
            promoCart={promoCart}
            setPromoCart={setPromoCart}
            {...props}
          >
            <Topbar />
          </MainMenuScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="PromotionScreen"
        options={{
          tabBarLabel: "โปรโมชั่น",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="percent" color={color} size={size} />
          ),
        }}
      >
        {(props) => (
          <PromotionScreen
            cartData={cartData}
            setCartData={setCartData}
            promoCart={promoCart}
            setPromoCart={setPromoCart}
            {...props}
          >
            <Topbar />
          </PromotionScreen>
        )}
      </Tab.Screen>
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
          tabBarLabel: "เดลิเวอรี",
          tabBarIcon: ({ color, size }) => (
            <>
              {notifCount ? (
                <VStack>
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 8,
                    }}
                    w={5}
                    h={5}
                    justifyContent="center"
                    p={0}
                    borderWidth={1}
                    borderColor="white"
                    mb={-3}
                    mr={-3}
                    zIndex={1}
                  >
                    {notifCount}
                  </Badge>
                  <MaterialIcons
                    name="delivery-dining"
                    color={color}
                    size={size}
                  />
                </VStack>
              ) : (
                <MaterialIcons
                  name="delivery-dining"
                  color={color}
                  size={size}
                />
              )}
            </>
          ),
        }}
      >
        {(props) => (
          <DeliveryScreen notifCount={notifCount} {...props}>
            <Topbar />
          </DeliveryScreen>
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
      >
        {(props) => (
          <ReportScreen {...props}>
            <Topbar />
          </ReportScreen>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SettingScreen"
        options={{
          tabBarLabel: "ตั้งค่า",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      >
        {(props) => (
          <SettingScreen {...props}>
            <Topbar />
          </SettingScreen>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
const App: React.FC<Props> = () => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: any; token: any }) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const LoadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken: string | null;

      try {
        userToken = await AsyncStorage.getItem("accessToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
      await authService
        .checkCurrentSession()
        .then((res) => {
          if (res.data.message == "เข้าสู่ระบบสำเร็จ")
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
        })
        .catch((error) => {
          if (error) dispatch({ type: "SIGN_OUT", token: null });
        });
    };

    void bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (userName: string, password: string) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        let userToken;
        await http
          .post<AccessToken>("/auth/signinApp", {
            branchUsername: userName.toLowerCase(),
            branchPassword: password,
          })
          .then(async (response) => {
            await deviceStorage.deleteJWT();
            await deviceStorage.setToken(response.data.accessToken);
            userToken = response.data.accessToken;
          });
        dispatch({ type: "SIGN_IN", token: userToken });
      },
      signOut: () => dispatch({ type: "SIGN_OUT", token: null }),
    }),
    []
  );

  const [IsReady, SetIsReady] = useState(false);

  if (!IsReady) {
    return (
      <AppLoading
        startAsync={LoadFonts}
        onFinish={() => {
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
            <AuthContext.Provider value={authContext}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                {state.userToken == null ? (
                  <Stack.Screen name="LogInScreen" component={LoginScreen} />
                ) : (
                  <Stack.Screen name="HomeScreen" component={HomeTabs} />
                )}
              </Stack.Navigator>
            </AuthContext.Provider>
          </NativeBaseProvider>
        </AlertProvider>
      </NavigationContainer>
    );
  }
};

export default App;
