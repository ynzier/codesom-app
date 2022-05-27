import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  Pressable,
  Divider,
  FormControl,
  NativeBaseProvider,
  Collapse,
} from "native-base";
import { TextInput } from "react-native-element-textinput";
import { Dropdown } from "ynzier-react-native-element-dropdown";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deliveryService } from "services";
import { StyleSheet } from "react-native";

const Delivery = (props: {
  isDelivery: any;
  setIsTakeAway: (arg0: boolean) => void;
  setIsDelivery: (arg0: boolean) => void;
}) => {
  return (
    <Pressable
      w="100"
      bg={props.isDelivery ? "emerald.500" : "transparent"}
      h="100"
      _pressed={{
        bg: "emerald.600",
      }}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.400"
      flexDirection="column-reverse"
      onPress={() => {
        props.setIsTakeAway(false);
        props.setIsDelivery(true);
      }}
    >
      {({ isPressed }) => (
        <>
          <Text color={isPressed || props.isDelivery ? "#fffdfa" : "black"}>
            เดลิเวอรี
          </Text>
          <MaterialCommunityIcons
            name="truck-outline"
            size={48}
            color={isPressed || props.isDelivery ? "#fffdfa" : "black"}
          />
        </>
      )}
    </Pressable>
  );
};

function TakeAway(props: {
  setError: (arg0: string) => void;
  isTakeAway: any;
  setIsDelivery: (arg0: boolean) => void;
  setIsTakeAway: (arg0: boolean) => void;
}) {
  return (
    <Pressable
      w="100"
      bg={props.isTakeAway ? "emerald.500" : "transparent"}
      _pressed={{
        bg: "emerald.600",
      }}
      h="100"
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.400"
      flexDirection="column-reverse"
      onPress={() => {
        props.setError("");
        props.setIsDelivery(false);
        props.setIsTakeAway(true);
      }}
    >
      {({ isPressed }) => (
        <>
          <Text color={isPressed || props.isTakeAway ? "#fffdfa" : "black"}>
            รับกลับ
          </Text>
          <MaterialCommunityIcons
            color={isPressed || props.isTakeAway ? "#fffdfa" : "black"}
            name="storefront-outline"
            size={48}
          />
        </>
      )}
    </Pressable>
  );
}
type NavProps = {
  navigate: (
    arg0: string,
    arg1?: { [key: string]: string | undefined }
  ) => void;
};
type IPlatformArray = {
  platformId: string;
  platformName: string;
};
const CartCheckOut = ({
  showModal,
  setShowModal,
  setCartData,
  setPromoCart,
  ...props
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  setCartData: (a: any) => void;
  setPromoCart: (a: any) => void;
  props?: any;
}) => {
  const navigation: NavProps = useNavigation();
  const [platformData, setPlatformData] = useState<IPlatformArray[]>([]);
  const [selected, setSelected] = useState<string>("-1");
  const [isDelivery, setIsDelivery] = useState<boolean>(false);
  const [isTakeAway, setIsTakeAway] = useState<boolean>(false);
  const [refNo, setRefNo] = useState<string | undefined>("");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    deliveryService
      .getAllPlatform()
      .then((res) => {
        const recData = res.data;
        setPlatformData(recData);
      })
      .catch((e) => console.log(e));

    return () => {
      setIsDelivery(false);
      setIsTakeAway(false);
      setRefNo("");
      setError("");
      setSelected("");
    };
  }, []);
  return (
    <Center>
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setIsDelivery(false);
          setError("");
          setRefNo("");
          setSelected("");
          setIsTakeAway(false);
          setShowModal(false);
        }}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header mx="4" borderBottomWidth={0} alignItems="center">
            เลือกวิธีรับสินค้า
          </Modal.Header>
          <Modal.Body _scrollview={{ scrollEnabled: false }}>
            <VStack>
              <HStack space="3">
                <Box
                  alignItems="flex-end"
                  shadow="4"
                  zIndex={4}
                  flex="1"
                  h="100%"
                  w="100%"
                >
                  <Delivery
                    isDelivery={isDelivery}
                    setIsDelivery={setIsDelivery}
                    setIsTakeAway={setIsTakeAway}
                  />
                </Box>
                <Box flex="1" shadow="4" zIndex={4} h="100%" w="100%">
                  <TakeAway
                    setError={setError}
                    setIsDelivery={setIsDelivery}
                    isTakeAway={isTakeAway}
                    setIsTakeAway={setIsTakeAway}
                  />
                </Box>
              </HStack>
              <Collapse isOpen={isDelivery}>
                <NativeBaseProvider>
                  <HStack mt="3" space="3">
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>
                        <Text fontFamily="Prompt-Medium">เลือกแพลตฟอร์ม</Text>
                      </FormControl.Label>
                      <Dropdown
                        style={styles.inputcontainer}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        iconStyle={styles.iconStyle}
                        data={platformData}
                        search={false}
                        maxHeight={300}
                        labelField="platformName"
                        valueField="platformId"
                        placeholder="แพลตฟอร์ม"
                        value={selected}
                        onChange={(item) => {
                          setSelected(item.platformId);
                        }}
                      />
                    </FormControl>
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>
                        <Text fontFamily="Prompt-Medium">หมายเลขอ้างอิง</Text>
                      </FormControl.Label>
                      <TextInput
                        value={refNo}
                        style={[styles.inputcontainer]}
                        inputStyle={styles.inputStyle}
                        placeholderStyle={styles.placeholderStyle}
                        iconStyle={styles.iconStyle}
                        placeholder="กรอกหมายเลขอ้างอิง"
                        placeholderTextColor="gray"
                        onChangeText={(text) => {
                          setRefNo(text);
                        }}
                      />
                    </FormControl>
                  </HStack>
                </NativeBaseProvider>
              </Collapse>
            </VStack>
            <Divider my="4" />
            <Button
              isDisabled={!isDelivery && !isTakeAway}
              colorScheme="emerald"
              _disabled={{ backgroundColor: "gray.400" }}
              onPress={() => {
                if (isTakeAway) {
                  setShowModal(false);
                  setCartData([]);
                  setPromoCart([]);
                  setIsTakeAway(false);
                  navigation.navigate("OrderScreen", {
                    orderType: "takeaway",
                  });
                } else if (isDelivery) {
                  if (
                    refNo != "" &&
                    (selected == "1" ||
                      selected == "2" ||
                      selected == "3" ||
                      selected == "4" ||
                      selected == "0")
                  ) {
                    setShowModal(false);
                    setCartData([]);
                    setPromoCart([]);

                    setIsDelivery(false);
                    navigation.navigate("OrderScreen", {
                      orderType: "delivery",
                      orderRefNo: refNo,
                      platformId: selected,
                    });
                    setIsDelivery(false);
                    setIsTakeAway(false);
                    setRefNo("");
                    setError("");
                    setSelected("");
                  } else {
                    setError("กรุณาเลือกแพลตฟอร์มและกรอกหมายเลขอ้างอิงก่อน");
                  }
                }
              }}
            >
              ต่อไป
            </Button>
            <Collapse my={2} isOpen={error ? true : false}>
              <Text color="danger.400">*{error}</Text>
            </Collapse>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default CartCheckOut;

const styles = StyleSheet.create({
  inputcontainer: {
    borderWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    justifyContent: "center",
    borderColor: "#e7e5e4",
    height: 40,
    borderRadius: 4,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: "Prompt-Light",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "Prompt-Light",
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  inputStyle: { fontSize: 14, fontFamily: "Prompt-Light" },
});
