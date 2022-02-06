import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Input,
  KeyboardAvoidingView,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
  Box,
} from "native-base";
import AuthService from "../services/auth.service";
import { Navigation } from "/hooks/navigation";
import axios from "axios";

type Props = {
  navigation: Navigation;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const _onLoginPressed = async () => {
    setLoading(true);
    await AuthService.signInApp(userName, password)
      .then((res) => {
        navigation.navigate("HomeScreen");
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
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const miloTeamURL =
    "https://www.facebook.com/%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2-Milo-110957550650650";
  return (
    <Center flex={1} px="3">
      <KeyboardAvoidingView
        h={{
          base: "400px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Center>
          <VStack
            flex="1"
            justifyContent="center"
            w="100%"
            minW="320"
            maxW="320"
          >
            <Box style={styles.boxStyle} p="6">
              <Heading
                fontFamily="heading"
                alignSelf="center"
                fontWeight={600}
                mb="4"
                color="#FF9C00"
              >
                เข้าสู่ระบบ
              </Heading>
              <Box style={styles.textInputBox} shadow="3" p="2" mb="3">
                <Text color="muted.500">Username</Text>

                <TextInput
                  placeholder="ใส่ชื่อผู้ใช้งาน"
                  keyboardType="default"
                  value={userName}
                  style={{ fontFamily: "Mitr-Regular" }}
                  onChangeText={(e) => setUserName(e)}
                />
              </Box>
              <Box style={styles.textInputBox} shadow="3" p="2" mb="3">
                <Text color="muted.500">Password</Text>

                <TextInput
                  placeholder="ใส่รหัสผ่าน"
                  value={password}
                  keyboardType="default"
                  style={{ fontFamily: "Mitr-Regular" }}
                  onChangeText={(e) => setPassword(e)}
                  secureTextEntry
                />
              </Box>
              <Button
                bgColor="#FF9C00"
                mb="4"
                shadow="3"
                borderRadius="12"
                onPress={_onLoginPressed}
              >
                ยืนยัน
              </Button>
              <Text color="muted.400" alignSelf="center">
                Milo Team
              </Text>
            </Box>
          </VStack>
        </Center>
      </KeyboardAvoidingView>
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxStyle: {
    justifyContent: "center",
    backgroundColor: "rgba(196,196,196,0.4)",
    borderRadius: 60,
    width: "100%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1,
  },

  textInputBox: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
  },

  creditTextStyle: {
    fontFamily: "Mitr-Regular",
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginScreen;
