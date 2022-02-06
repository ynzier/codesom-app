import React, { useState } from "react";
import {
  Button,
  HStack,
  VStack,
  Text,
  Link,
  Checkbox,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Icon,
  Pressable,
  Center,
  Hidden,
  StatusBar,
  Stack,
  Box,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

import IconGoogle from "../components/IconGoogle";
import IconFacebook from "../components/IconFacebook";
import FloatingLabelInput from "../components/FloatingLabelInput";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export function SignInForm({ props }: any) {
  // add next router here
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = React.useState(false);
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ flex: 1 }}
    >
      <VStack
        flex="1"
        px="6"
        py="9"
        _light={{ bg: "white" }}
        _dark={{ bg: "coolGray.800" }}
        space="3"
        justifyContent="space-between"
        borderTopRightRadius={{ base: "2xl", md: "xl" }}
        borderBottomRightRadius={{ base: "0", md: "xl" }}
        borderTopLeftRadius={{ base: "2xl", md: "0" }}
      >
        <VStack space="7">
          <Hidden till="md">
            <Text fontSize="lg" fontWeight="normal">
              เข้าสู่ระบบ
            </Text>
          </Hidden>
          <VStack>
            <VStack space="3">
              <VStack space={{ base: "7", md: "4" }}>
                <FloatingLabelInput
                  isRequired
                  label="ชื่อผู้ใช้งาน"
                  labelColor="#9ca3af"
                  labelBGColor={useColorModeValue("#fff", "#1f2937")}
                  borderRadius="4"
                  defaultValue={userName}
                  onChangeText={(txt: any) => setUserName(txt)}
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
                <FloatingLabelInput
                  isRequired
                  type={showPass ? "" : "password"}
                  label="Password"
                  borderRadius="4"
                  labelColor="#9ca3af"
                  labelBGColor={useColorModeValue("#fff", "#1f2937")}
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
                        setShowPass(true);
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
                }}
                _light={{
                  bg: "#FF9C00",
                }}
                onPress={() => {
                  props.navigation.navigate("OTP");
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
                  w="50%"
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
      </VStack>
    </KeyboardAwareScrollView>
  );
}
export default function SignIn(props: any) {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Box safeAreaTop bg="#FFB848" />
      <Center my="auto" bg="#FFB848" flex="1">
        <Stack
          flexDirection={{ base: "column", md: "row" }}
          w="100%"
          maxW={{ md: "800px" }}
          flex="0"
        >
          <Center
            flex="1"
            bg="#ff9c00"
            borderTopLeftRadius={{ base: "0", md: "xl" }}
            borderBottomLeftRadius={{ base: "0", md: "xl" }}
          >
            <Image
              alt="NativeBase Startup+ "
              resizeMode={"contain"}
              source={require("../components/logo.png")}
            />
          </Center>
          <SignInForm props={props} />
        </Stack>
      </Center>
    </>
  );
}
