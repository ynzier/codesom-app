import React from "react";
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
} from "native-base";
import SelectPicker from "react-native-form-select-picker";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AlertToast from "./AlertToast";

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
  navigate: (any: string) => void;
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
  const [selected, setSelected] = useState();
  const [isDelivery, setIsDelivery] = useState(false);
  const [isTakeAway, setIsTakeAway] = useState(false);
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
                    setIsDelivery={setIsDelivery}
                    isTakeAway={isTakeAway}
                    setIsTakeAway={setIsTakeAway}
                  ></TakeAway>
                </Box>
              </HStack>
              {isDelivery && (
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
                          height: 33,
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
                        <SelectPicker.Item label="Grab" value="3" />
                        <SelectPicker.Item label="Line Man" value="4" />
                        <SelectPicker.Item label="Robinhood" value="2" />
                        <SelectPicker.Item label="อื่นๆ" value="1" />
                      </SelectPicker>
                    </FormControl>
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>
                        <Text fontFamily="Mitr-Medium">หมายเลขอ้างอิง</Text>
                      </FormControl.Label>
                      <Input />
                    </FormControl>
                  </HStack>
                </NativeBaseProvider>
              )}
            </VStack>
            <Divider my="4" />
            <Button
              isDisabled={!isDelivery && !isTakeAway}
              colorScheme="success"
              _disabled={{ backgroundColor: "gray.400" }}
              onPress={() => {
                AlertToast("บันทึกรายการสำเร็จ!", "success");
                setShowModal(false);
                navigation.navigate("OrderScreen");
              }}
            >
              ต่อไป
            </Button>
            {/* <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Sub Total</Text>
                <Text color="blueGray.400">$298.77</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Tax</Text>
                <Text color="blueGray.400">$38.84</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total Amount</Text>
                <Text color="green.500">$337.61</Text>
              </HStack>
            </VStack> */}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default CheckOutModal;