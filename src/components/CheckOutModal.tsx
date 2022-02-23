import React from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Radio,
  Center,
  Icon,
  Box,
  Pressable,
  Divider,
  FormControl,
  Input,
  NativeBaseProvider,
  CheckIcon,
  Select,
} from "native-base";
import SelectPicker from "react-native-form-select-picker";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const CheckOutModal = ({
  showModal,
  setShowModal,
  ...props
}: {
  showModal: boolean;
  setShowModal: (boolean: boolean) => void;
  props?: any;
}) => {
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [isTakeAway, setIsTakeAway] = useState(false);
  return (
    <Center>
      <Modal
        avoidKeyboard
        isOpen={showModal}
        onClose={() => {
          setIsDelivery(false);
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
                      <FormControl.Label color="green.400">
                        เลือกแพลตฟอร์ม
                      </FormControl.Label>
                      <SelectPicker
                        style={{
                          borderWidth: 1,
                          paddingTop: 0,
                          paddingBottom: 0,
                          justifyContent: "center",
                          height: 33,
                          borderRadius: 4,
                        }}
                        selected="test"
                        onValueChange={() => {}}
                      >
                        <SelectPicker.Item label="test" value="test" />
                        <SelectPicker.Item label="ta" value="ta" />
                        <SelectPicker.Item label="test" value="test" />
                        <SelectPicker.Item label="test" value="test" />
                        <SelectPicker.Item label="test" value="test" />
                      </SelectPicker>
                    </FormControl>
                    <FormControl flex="1" w="100%">
                      <FormControl.Label>test</FormControl.Label>
                      <Input></Input>
                    </FormControl>
                  </HStack>
                </NativeBaseProvider>
              )}
            </VStack>
            <Divider my="4" />
            <Button colorScheme="success">ต่อไป</Button>
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
