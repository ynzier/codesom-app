import React, { useState, useCallback } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Pressable,
  Button,
  VStack,
  Input,
  Icon,
  Divider,
  Spinner,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import IconCart from "../IconCart";
import Feather from "react-native-vector-icons/Feather";
import CheckOutModal from "../CheckOutModal";
// import AlertToast from "../AlertToast";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";

const StorageSidebar: React.FC<Props> = () => {
  const [sumAll, setSumAll] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("0");
  const [total, setTotal] = useState("0");

  return (
    <>
      <HStack w="100%" flex="1" bg="#FFF0D9">
        <VStack w="100%" flex="1" justifyContent="center" alignItems="center">
          <Box
            flex="1"
            margin="0"
            w="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="48">ประวัติคำขอ</Text>
          </Box>
          {/** Request List */}
          <Divider thickness="1" mb={4} width="90%" bg="black" />
          <Box flex="8" w="100%" h="100%" justifyContent="center"></Box>
          {/* Bottom */}
          <Box
            flex="1"
            w="100%"
            h="100%"
            bg="#FFF0D9"
            px="4"
            alignItems="center"
          >
            <Button
              borderRadius="xl"
              colorScheme="greenalt"
              mx="4"
              w="100%"
              h="75%"
              _text={{ fontSize: 20, color: "white" }}
              onPress={async () => {}}
            >
              สร้างคำขอ
            </Button>
          </Box>
        </VStack>
      </HStack>
    </>
  );
};

export default StorageSidebar;
