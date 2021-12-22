import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Linking,
  Pressable,
} from "react-native";

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const LoginScreen: React.FC<Props> = ({
  navigation,
  name,
  baseEnthusiasmLevel = 0,
}) => {
  const miloTeamURL =
    "https://www.facebook.com/%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2-Milo-110957550650650";
  return (
    <View style={styles.container}>
      {/* Grey Box */}
      <View style={styles.boxStyle}>
        {/* Body */}
        <Text style={styles.textStyle}>เข้าสู่ระบบ</Text>
        <View style={styles.textInputBox}>
          <Text style={styles.inputTextHeader}>Username</Text>
          <TextInput
            style={styles.inputBox}
            onChangeText={(text) => {}}
            editable
            maxLength={20}
            placeholder="ชื่อผู้ใช้งาน"
          />
        </View>
        <View style={styles.textInputBox}>
          <Text style={styles.inputTextHeader}>Password</Text>
          <TextInput
            style={styles.inputBox}
            onChangeText={(text) => {}}
            editable
            secureTextEntry
            maxLength={20}
            placeholder="รหัสผ่าน"
          />
        </View>
        <TouchableHighlight
          activeOpacity={0.2}
          underlayColor="none"
          style={[styles.button, styles.buttonConfirm]}
          onPress={() => {
            navigation.navigate("LogInScreen");
          }}
        >
          <Text style={styles.confirmTextStyle}>ยืนยัน</Text>
        </TouchableHighlight>

        {/* Footer */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            onPress={() => {
              Linking.openURL(miloTeamURL);
            }}
          >
            <Text style={styles.creditTextStyle}>Milo Team</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxStyle: {
    marginTop: 60,
    marginBottom: 60,
    backgroundColor: "rgba(196,196,196,0.4)",
    borderRadius: 60,
    width: "40%",
    height: "60%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1,
    alignItems: "center",
    alignContent: "center",
  },
  button: {
    marginTop: 34,
    borderRadius: 100,
    width: "60%",
    height: 69,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
    justifyContent: "center",
  },
  buttonConfirm: {
    backgroundColor: "#0AC265",
  },
  confirmTextStyle: {
    fontFamily: "Mitr-SemiBold",
    color: "white",
    textAlign: "center",
    fontSize: 24,
  },
  textInputBox: {
    width: "60%",
    height: 60,
    marginTop: 34,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1,
  },
  inputTextHeader: {
    marginTop: 5,
    marginLeft: 16,
    fontFamily: "Mitr-Regular",
    color: "rgba(255, 156, 0, 0.87)",
    fontSize: 14,
  },
  inputBox: {
    marginLeft: 16,
    fontFamily: "Mitr-Regular",
    color: "rgba(0,0,0, 0.87)",
    fontSize: 18,
  },
  textStyle: {
    fontFamily: "Mitr-Regular",
    color: "#FF9C00",
    textAlign: "center",
    fontSize: 48,
    marginTop: 42,
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
