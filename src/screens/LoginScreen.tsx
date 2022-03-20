import React, { useState, useContext } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Constants from "expo-constants";

import {
  Button,
  HStack,
  VStack,
  Text,
  Divider,
  Image,
  IconButton,
  KeyboardAvoidingView,
  Icon,
  Center,
  StatusBar,
  Stack,
  Box,
  Spinner,
} from "native-base";
import { Platform, StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { TextInput } from "react-native-element-textinput";
import { AuthContext } from "../context/AuthContext";

const SignInForm = () => {
  const { signIn } = useContext(AuthContext);

  const { promiseInProgress } = usePromiseTracker();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);

  const _onLoginPressed = async () => {
    await trackPromise(
      signIn(userName, password).catch(
        (error: {
          response: { data: { message: any } };
          message: any;
          toString: () => any;
        }) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "คำเตือน!",
            textBody: resMessage,
          });
        }
      )
    );
  };

  return (
    <VStack
      shadow={2}
      flex={{ md: 1, xl: 0.5 }}
      ml={{ md: 20, xl: 0 }}
      mr={{ xl: 40 }}
      borderRadius={10}
      justifyContent="center"
      bg="#FFFDFA"
    >
      <Center>
        <VStack
          space="4"
          alignItems="center"
          justifyContent="center"
          py={{ md: 8, xl: 0 }}
        >
          <Image
            w={{ md: 100, xl: 150 }}
            h={{ md: 100, xl: 150 }}
            alt="Codesom "
            resizeMode={"contain"}
            source={require("../assets/logo-black.png")}
          />
          <Text fontSize="lg" fontWeight="normal">
            เข้าสู่ระบบ
          </Text>
          <VStack>
            <VStack space="3">
              <VStack space={{ base: "7", md: "4" }}>
                <TextInput
                  value={userName}
                  style={styles.input}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="ชื่อผู้ใช้งาน"
                  placeholder="ชื่อผู้ใช้งาน"
                  placeholderTextColor="gray"
                  onChangeText={(txt: any) => setUserName(txt)}
                />
                <TextInput
                  value={password}
                  style={styles.input}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="รหัสผ่าน"
                  placeholder="รหัสผ่าน"
                  placeholderTextColor="gray"
                  secureTextEntry={!showPass}
                  onChangeText={(txt: any) => setPassword(txt)}
                  renderRightIcon={() => (
                    <IconButton
                      variant="unstyled"
                      icon={
                        <Icon
                          size="4"
                          color="coolGray.400"
                          as={Entypo}
                          name={showPass ? "eye-with-line" : "eye"}
                        />
                      }
                      onPress={() => {
                        setShowPass(!showPass);
                      }}
                    />
                  )}
                />
              </VStack>
              <Button
                alignSelf="center"
                mt="5"
                w="70%"
                h="50px"
                disabled={promiseInProgress}
                borderRadius="4"
                _text={{
                  fontSize: 18,
                  fontWeight: "400",
                  color: "white",
                }}
                colorScheme="altred"
                onPress={() => {
                  void _onLoginPressed();
                }}
              >
                {promiseInProgress ? (
                  <Spinner size="lg" color="cream" />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
              {/* Closing Link Tag */}
              <HStack
                mt="5"
                space="2"
                mb={{ base: 6, md: 7 }}
                alignItems="center"
                justifyContent="center"
              >
                <Divider
                  w="70%"
                  _light={{ bg: "coolGray.200" }}
                  _dark={{ bg: "coolGray.700" }}
                ></Divider>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
        <HStack
          mb="4"
          space="2"
          safeAreaBottom
          alignItems="center"
          justifyContent="center"
          mt={{ base: "auto" }}
        >
          <Text
            _light={{ color: "coolGray.800" }}
            _dark={{ color: "coolGray.400" }}
          >
            Milo Team@{Constants?.manifest?.version}
          </Text>
        </HStack>
      </Center>
    </VStack>
  );
};
const LoginScreen = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box safeAreaTop bg="cream" />
      <Center my="auto" bg="cream" flex="1">
        <KeyboardAvoidingView
          h={{
            base: "400px",
            lg: "auto",
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Stack
            flexDirection={{ base: "column", md: "row" }}
            w="100%"
            h={{ md: "500px", xl: "600px" }}
            flex="0"
            px="40"
          >
            <Center flex="1">
              <Image
                w="80%"
                h="80%"
                alt="Codesom "
                resizeMode={"contain"}
                source={require("../assets/logo-white.png")}
              />
            </Center>
            <SignInForm />
          </Stack>
        </KeyboardAvoidingView>
      </Center>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#d1d5db",
  },
  inputStyle: { fontSize: 16, fontFamily: "Prompt-Regular", letterSpacing: 1 },
  labelStyle: {
    fontSize: 14,
    color: "#9ca3af",
    position: "absolute",
    top: -10,
    backgroundColor: "#FFFDFA",
    paddingHorizontal: 4,
    marginLeft: -4,
    fontFamily: "Prompt-Regular",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9ca3af",
    fontFamily: "Prompt-Regular",
    letterSpacing: 1,
  },
  textErrorStyle: { fontSize: 16 },
});

export default LoginScreen;
