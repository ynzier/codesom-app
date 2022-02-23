import React, { useState } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
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
import { Platform } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AlertToast from "../components/AlertToast";
import AuthService from "../services/auth.service";
import FloatingLabelInput from "../components/FloatingLabelInput";

export function SignInForm({ props }: any) {
  const { promiseInProgress } = usePromiseTracker();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);

  const _onLoginPressed = () => {
    void trackPromise(
      AuthService.signInApp(userName, password)
        .then((_res) => {
          props.navigation.navigate("HomeScreen");
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          AlertToast(resMessage, "alert");
        })
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
            Milo Team
          </Text>
          {/* Opening Link Tag navigateTo:"SignUp" */}
        </HStack>
      </Center>
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
            <SignInForm props={props} />
          </Stack>
        </KeyboardAvoidingView>
      </Center>
    </>
  );
}
