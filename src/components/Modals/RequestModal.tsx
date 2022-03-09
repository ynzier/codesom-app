import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Center,
  Box,
  ScrollView,
  Spinner,
  AlertDialog,
  Pressable,
} from "native-base";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { storageService } from "services";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { MultiSelect } from "ynzier-react-native-element-dropdown";
import { TextInput } from "react-native-element-textinput";

const data = [
  { key: 1, name: "น้ำส้ม", id: "14232", unit: "ชิ้น", type: "สินค้า" },
  { key: 2, name: "ผงกาแฟ", id: "224", unit: "ลิตร", type: "ส่วนผสม" },
  { key: 3, name: "ผงโกโก้", id: "4223", unit: "กก.", type: "ส่วนผสม" },
  { key: 4, name: "น้ำมะนาว", id: "43", unit: "กก.", type: "อื่นๆ" },
  { key: 5, name: "Item 5", id: "521", unit: "แพค", type: "อื่นๆ" },
  { key: 6, name: "Item 6", id: "644", unit: "กระสอบ", type: "ส่วนผสม" },
  { key: 7, name: "Item 7", id: "732", unit: "ลิตร", type: "ส่วนผสม" },
  { key: 8, name: "Item 8", id: "811", unit: "กก.", type: "สินค้า" },
];

const RequestModal = ({
  showRequest,
  setShowRequest,
}: {
  showRequest: boolean;
  setShowRequest: (boolean: boolean) => void;
  props?: any;
}) => {
  const [optionList, setOptionList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [itemList, setItemList] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);

  useEffect(() => {
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            storageService
              .getItemMakeRequest()
              .then((res) => {
                setOptionList(res.data);
              })
              .catch((e) => {
                console.log(e);
              })
          );
        }, 2000);
      })
    );

    return () => {};
  }, []);

  const addItemToList = (item: any) => {
    setItemList((prev: any) => [...prev, item]);
  };
  const handleQuantityChange = (text: any, key: any) => {
    if (text) {
      const index = itemList.findIndex((obj: any) => (obj.value = key));
      setItemList(
        Object.values({
          ...itemList,
          [index]: { ...itemList[index], quantity: text },
        })
      );
    }
  };
  const cleanUp = () => {
    setItemList([]);
    setSelected([]);
  };
  const filterZeroQuantity = () => {
    const filtered = itemList.filter(
      (obj: any) => obj.quantity && obj.quantity > 0
    );

    if (!filtered.length) {
      setSelected([]);
      return Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: "ทำรายการไม่สำเร็จ กรุณาตรวจสอบจำนวนสินค้าก่อนทำรายการ",
      });
    }
    setIsLoading(true);
    setTimeout(() => {
      console.log(filtered);
      cleanUp();
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: "ทำรายการสำเร็จ",
      });
    }, 5000);
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        <Text style={styles.selectItemType}>({item.type})</Text>
      </View>
    );
  };
  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        filterZeroQuantity={filterZeroQuantity}
      />
      <Modal
        isOpen={showRequest}
        onClose={() => {
          setSelected([]);
          setItemList([]);
          setShowRequest(false);
        }}
        size="lg"
      >
        <Modal.Content h="700" maxWidth="600" borderRadius="40">
          <Modal.CloseButton mr="4" mt="2" />
          <VStack mt="8" mx="16">
            <Box h="16">
              <Text
                textAlign="center"
                fontFamily="heading"
                fontWeight={700}
                fontSize="lg"
              >
                เพิ่มวัตถุดิบ
              </Text>
            </Box>
            <HStack mb="2">
              <Text flex="1" fontSize={16}>
                รายการวัตถุดิบ
              </Text>
              <Pressable onPress={cleanUp}>
                <MaterialIcons
                  name="cleaning-services"
                  size={24}
                  color="black"
                  style={{ transform: [{ rotate: "30deg" }] }}
                />
              </Pressable>
            </HStack>

            <ScrollView h="400">
              <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                fontFamily="Prompt-Regular"
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={optionList}
                labelField="ืname"
                showsVerticalScrollIndicator
                valueField="value"
                placeholder="เลือกสินค้า..."
                value={selected}
                search
                searchPlaceholder="Search..."
                onChange={(item) => {
                  setSelected(item);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    name="cube"
                    style={styles.icon}
                    size={24}
                    color="black"
                  />
                )}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => {
                  const isExisted = itemList.find(
                    (entry: any) => entry.value == item.value
                  );
                  if (!isExisted) {
                    addItemToList(item);
                  }
                  return (
                    <TouchableOpacity>
                      <View style={styles.selectedStyle}>
                        <Text style={styles.textSelectedStyle}>
                          {item.name}
                        </Text>
                        <Text style={styles.textSelectedStyle}>
                          ({item.type})
                        </Text>
                        <TextInput
                          style={styles.quantityInput}
                          showIcon={false}
                          inputStyle={styles.quantityText}
                          numeric
                          maxLength={3}
                          placeholder="0"
                          onChangeText={(text) => {
                            const count = parseInt(text);
                            handleQuantityChange(count, item.value);
                          }}
                        />
                        <Text>{item.unit}</Text>
                        <Ionicons
                          name="trash-bin-sharp"
                          style={styles.selectedIcon}
                          onPress={() => {
                            unSelect && unSelect(item);
                            const filtered = itemList.filter(
                              (obj: any) => obj.value != item.value
                            );
                            setItemList(filtered);
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
            <Button
              h="16"
              colorScheme="emerald"
              _text={{ fontSize: 24 }}
              onPress={() => {
                setIsOpen(true);
              }}
            >
              {isLoading ? <Spinner size="lg" color="cream" /> : "ยืนยัน"}
            </Button>
          </VStack>
        </Modal.Content>
      </Modal>
    </>
  );
};

const ConfirmDialog = ({
  isOpen,
  setIsOpen,
  filterZeroQuantity,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  filterZeroQuantity: () => void;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };
  const onConfirm = () => {
    filterZeroQuantity();
    setIsOpen(false);
  };

  const cancelRef = useRef(null);
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>ยืนยัน</AlertDialog.Header>
          <AlertDialog.Body>ตรวจสอบรายการถูกต้องแล้วหรือไม่ ?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                ยกเลิก
              </Button>
              <Button colorScheme="emerald" onPress={onConfirm}>
                ยืนยัน
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default RequestModal;
const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: { width: 32, marginRight: 4, height: 32 },
  quantityText: { textAlign: "right", textDecorationLine: "underline" },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    fontFamily: "Prompt-SemiBold",
    color: "#949494",
    marginRight: 8,
    fontSize: 16,
  },
  selectedIcon: { color: "#545454", fontSize: 18, marginLeft: 4 },
  selectItemType: { marginLeft: 8, fontSize: 16 },
  selectItemIcon: {
    marginRight: 5,
  },
});
