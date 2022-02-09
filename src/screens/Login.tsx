import React, { useState } from "react";
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
} from "native-base";
import { Alert, Platform } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

import AuthService from "../services/auth.service";
import FloatingLabelInput from "../components/FloatingLabelInput";


export function SignInForm({ props }: any) {
  // add next router here
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);

  const _onLoginPressed = async () => {
    await AuthService.signInApp(userName, password)
      .then((res) => {
        props.navigation.navigate("HomeScreen");
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
  };

  return (
    <VStack
      flex="1"
      px="6"
      py={{ base: "7", md: "12", xl: "0" }}
      pb={{ xl: 4 }}
      bg="#FFFDFA"
      space="3"
      justifyContent="space-between"
      borderTopRightRadius={{ base: "2xl", md: "xl" }}
      borderBottomRightRadius={{ base: "0", md: "xl" }}
      borderTopLeftRadius={{ base: "2xl", md: "0" }}
    >
      <Center pt={{ xl: "40" }}>
        <VStack space="7" alignItems="center" justifyContent="center">
          <Text fontSize="lg" fontWeight="normal">
            เข้าสู่ระบบ
          </Text>
          <VStack>
            <VStack space="3">
              <VStack space={{ base: "7", md: "4" }}>
                <FloatingLabelInput
                  isRequired
                  label="ชื่อผู้ใช้งาน"
                  labelColor="#9ca3af"
                  labelBGColor="#FFFDFA"
                  borderRadius="8"
                  defaultValue={userName}
                  onChangeText={(txt: any) => setUserName(txt)}
                  _text={{
                    fontSize: "sm",
                    fontWeight: "medium",
                  }}
                  borderColor="coolGray.300"
                />
                <FloatingLabelInput
                  isRequired
                  type={showPass ? "" : "password"}
                  label="รหัสผ่าน"
                  borderRadius="8"
                  labelColor="#9ca3af"
                  labelBGColor="#FFFDFA"
                  defaultValue={password}
                  onChangeText={(txt: any) => setPassword(txt)}
                  InputRightElement={
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
                  }
                  _text={{
                    fontSize: "sm",
                    fontWeight: "medium",
                  }}
                  _dark={{
                    borderColor: "coolGray.700",
                  }}
                  _light={{
                    borderColor: "coolGray.300",
                  }}
                />
              </VStack>
              {/* Opening Link Tag navigateTo:"OTP" (react/Router) */}
              <Button
                mt="5"
                size="md"
                borderRadius="4"
                _text={{
                  fontWeight: "medium",
                  color: "white",
                }}
                bg="altred"
                _pressed={{ bg: "#922339" }}
                onPress={() => {
                  void _onLoginPressed();
                }}
              >
                SIGN IN
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
      </Center>
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
          Milo Team
        </Text>
        {/* Opening Link Tag navigateTo:"SignUp" */}
      </HStack>
    </VStack>
  );
}
export default function SignIn(props: any) {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box safeAreaTop bg="rgba(249, 220, 194, 0.5)" />
      <Center my="auto" bg="rgba(249, 220, 194, 0.5)" flex="1">
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
            maxW={{ md: "800px", xl: "1200px" }}
            h={{ md: "400px", xl: "600px" }}
            flex="0"
          >
            <Center
              flex="1"
              bg="#9D7463"
              borderTopLeftRadius={{ base: "0", md: "xl" }}
              borderBottomLeftRadius={{ base: "0", md: "xl" }}
            >
              <Image
                alt="Codesom "
                resizeMode={"contain"}
                source={require("../components/logo.png")}
              />
            </Center>
            <SignInForm props={props} />
          </Stack>
        </KeyboardAvoidingView>
      </Center>
    </>
  );
}
