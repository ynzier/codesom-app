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
  Input,
  NativeBaseProvider,
  Collapse,
} from "native-base";
import SelectPicker from "react-native-form-select-picker";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ordersService from "../services/orders.service";
import deliveryService from "../services/delivery.service";

function Delivery(props: {
  isDelivery: any;
  setIsTakeAway: (arg0: boolean) => void;
  setIsDelivery: (arg0: boolean) => void;
}) {
  return (
    <Pressable
      w="100"
      bg={props.isDelivery ? "emerald.500" : "#FFFDFA"}
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
            เดลิเวอรี่
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
}

function TakeAway(props: {
  setError: (arg0: string) => void;
  isTakeAway: any;
  setIsDelivery: (arg0: boolean) => void;
  setIsTakeAway: (arg0: boolean) => void;
}) {
  return (
    <Pressable
      w="100"
      bg={props.isTakeAway ? "emerald.500" : "#FFFDFA"}
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
  platformId: number;
  platformName: string;
};
const CheckOutModal = ({
  showModal,
  setShowModal,
  ...props
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  props?: any;
}) => {
  const navigation: NavProps = useNavigation();
  const [platformData, setPlatformData] = useState<IPlatformArray[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [isDelivery, setIsDelivery] = useState<boolean>(false);
  const [isTakeAway, setIsTakeAway] = useState<boolean>(false);
  const [refNo, setRefNo] = useState<string | undefined>("");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setIsDelivery(false);
    setIsTakeAway(false);
    setRefNo("");
    setError("");
    setSelected("");
    deliveryService
      .getAllPlatform()
      .then((res) => {
        const recData = res.data;
        setPlatformData(recData);
      })
      .catch((e) => console.log(e));

    return () => {};
  }, []);
  return (
    <Center>
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setIsDelivery(false);
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
                  ></Delivery>
                </Box>
                <Box flex="1" shadow="4" zIndex={4} h="100%" w="100%">
                  <TakeAway
                    setError={setError}
                    setIsDelivery={setIsDelivery}
                    isTakeAway={isTakeAway}
                    setIsTakeAway={setIsTakeAway}
                  ></TakeAway>
                </Box>
              </HStack>
              <Collapse isOpen={isDelivery}>
                <NativeBaseProvider>
                  <HStack mt="3" space="3">
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>
                        <Text fontFamily="Mitr-Medium">เลือกแพลตฟอร์ม</Text>
                      </FormControl.Label>
                      <SelectPicker
                        style={{
                          borderWidth: 1,
                          paddingTop: 0,
                          paddingBottom: 0,
                          justifyContent: "center",
                          borderColor: "#e7e5e4",
                          height: 40,
                          borderRadius: 4,
                        }}
                        selected={selected}
                        placeholder="เลือกแพลตฟอร์ม"
                        onSelectedStyle={{ fontFamily: "Mitr-Light" }}
                        placeholderStyle={{ fontFamily: "Mitr-Light" }}
                        onValueChange={(value) => {
                          setSelected(value);
                        }}
                      >
                        {platformData.map((item, index) => (
                          <SelectPicker.Item
                            key={item.platformId.toString()}
                            label={item.platformName}
                            value={item.platformId}
                          />
                        ))}
                      </SelectPicker>
                    </FormControl>
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>
                        <Text fontFamily="Mitr-Medium">หมายเลขอ้างอิง</Text>
                      </FormControl.Label>
                      <Input
                        h="10"
                        placeholder="หมายเลขอ้างอิง"
                        onChangeText={(e) => setRefNo(e)}
                      />
                    </FormControl>
                  </HStack>
                </NativeBaseProvider>
              </Collapse>
            </VStack>
            <Divider my="4" />
            <Button
              isDisabled={!isDelivery && !isTakeAway}
              colorScheme="success"
              _disabled={{ backgroundColor: "gray.400" }}
              onPress={() => {
                if (isTakeAway) {
                  setShowModal(false);
                  navigation.navigate("OrderScreen", {
                    ordType: "takeaway",
                    ordRefNo: "",
                    platformId: "",
                  });
                } else if (isDelivery) {
                  if (refNo != "" && selected != "") {
                    setShowModal(false);
                    navigation.navigate("OrderScreen", {
                      ordType: "delivery",
                      ordRefNo: refNo,
                      platformId: selected,
                    });
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

export default CheckOutModal;
