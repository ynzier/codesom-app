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
  Collapse,
  Spacer,
} from "native-base";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { requisitionService, employeeService, storageService } from "services";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { MultiSelect, Dropdown } from "ynzier-react-native-element-dropdown";
import { TextInput } from "react-native-element-textinput";
const StuffWithdraw = ({
  showRequest,
  setShowRequest,
}: {
  showRequest: boolean;
  setShowRequest: (boolean: boolean) => void;
  props?: any;
}) => {
  const { promiseInProgress } = usePromiseTracker();
  const [optionList, setOptionList] = useState<any>([]);
  const [empList, setEmpList] = useState([]);
  const [creator, setCreator] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [itemList, setItemList] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            storageService
              .getAllStuffForWithdraw()
              .then((res) => {
                setOptionList(res.data);
              })
              .catch((e) => {
                console.log(e);
              })
          );
          resolve(
            employeeService
              .getAllEmployeeInBranch()
              .then((res) => {
                if (res && res.data.employees) {
                  const data = res.data.employees;
                  const newList: any = [];
                  data.forEach(
                    (obj: {
                      empId: any;
                      firstName: string;
                      lastName: string;
                    }) => {
                      newList.push({
                        value: obj.empId,
                        label: obj.firstName + " " + obj.lastName,
                      });
                    }
                  );
                  setEmpList(newList);
                }
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
    const selectedArray: any = [];
    item.forEach((element: any) => {
      const index = itemList.findIndex((e: any) => e.stuffId === element);
      if (index > -1) selectedArray.push(itemList[index]);
      else {
        optionList.find((entry: any) => {
          if (element == entry.stuffId) selectedArray.push(entry);
        });
      }
    });
    setItemList(selectedArray);
  };
  const handleQuantityChange = (text: any, key: any) => {
    if (text) {
      const index = itemList.findIndex((obj: any) => obj.stuffId == key);
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
    setCreator(0);
  };
  const getItemQuantity = (item: any): string => {
    const index = itemList.findIndex((obj: any) => obj.stuffId == item.stuffId);
    return itemList[index].quantity;
  };
  const filterZeroQuantity = () => {
    if (itemList.length < 1) return setError("กรุณาเลือกสินค้าก่อนทำการยืนยัน");
    const filtered = itemList.find(
      (obj: any) => !obj.quantity || obj.quantity == 0
    );

    if (filtered) {
      return setError("ทำรายการไม่สำเร็จ กรุณาตรวจสอบจำนวนสินค้าก่อนทำรายการ");
    }
    if (!creator) return setError("ลงชื่อผู้ขอเบิกสินค้าก่อนทำการยืนยัน");

    setError("");
    return setIsOpen(true);
  };

  const postData = () => {
    // const sendData = {
    //   reqHeader: {
    //     creatorId: creator,
    //     itemCount: itemList.length,
    //   },
    //   requisitionItems: itemList,
    // };
    // void trackPromise(
    //   new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve(
    //         requisitionService
    //           .createReqApp(sendData)
    //           .then((res) => {
    //             if (res) {
    //               setError("");
    //               cleanUp();
    //               Toast.show({
    //                 type: ALERT_TYPE.SUCCESS,
    //                 textBody: "ทำรายการสำเร็จ",
    //               });
    //               setShowRequest(false);
    //             }
    //           })
    //           .catch((error) => {
    //             const resMessage =
    //               (error.response &&
    //                 error.response.data &&
    //                 error.response.data.message) ||
    //               error.message ||
    //               error.toString();
    //             setError(resMessage);
    //           })
    //       );
    //     }, 2000);
    //   })
    // );
  };
  const renderEmpItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        postData={postData}
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
                เพิ่ม
              </Text>
            </Box>
            {promiseInProgress ? (
              <Spinner size="lg" color="cream" />
            ) : (
              <>
                <HStack mb="3">
                  <Text flex="1" fontSize={16}>
                    รายการที่ต้องการเบิก
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
                <ScrollView h="380">
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    fontFamily="Prompt-Regular"
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={optionList}
                    labelField="stuffName"
                    showsVerticalScrollIndicator
                    valueField="stuffId"
                    placeholder="เลือกสินค้า..."
                    value={selected}
                    search
                    searchPlaceholder="Search..."
                    onChange={(item) => {
                      addItemToList(item);
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
                    renderSelectedItem={(item, unSelect) => {
                      return (
                        <TouchableOpacity>
                          <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>
                              {item.stuffName}
                            </Text>
                            <TextInput
                              style={styles.quantityInput}
                              showIcon={false}
                              inputStyle={styles.quantityText}
                              numeric
                              value={getItemQuantity(item)}
                              maxLength={3}
                              placeholder="0"
                              onChangeText={(text) => {
                                const count = parseInt(text);
                                if (count <= item.itemRemain)
                                  handleQuantityChange(count, item.stuffId);
                              }}
                            />
                            <Text>{item.stuffUnit}</Text>
                            <Ionicons
                              name="trash-bin-sharp"
                              style={styles.selectedIcon}
                              onPress={() => {
                                unSelect && unSelect(item);
                                const filtered = itemList.filter(
                                  (obj: any) => obj.stuffId != item.stuffId
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
                <HStack w="100%" mt="3">
                  <VStack flex="3">
                    <Text mb="3" fontSize={16}>
                      ลงชื่อผู้ขอเบิกคลังสินค้า
                    </Text>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      fontFamily="Prompt-Regular"
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={empList}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="ลงชื่อผู้เบิกคลังสินค้า"
                      searchPlaceholder="ค้นหา..."
                      value={creator}
                      onChange={(item) => {
                        setCreator(item.value);
                      }}
                      renderLeftIcon={() => (
                        <FontAwesome5
                          name="signature"
                          style={styles.icon}
                          size={24}
                          color="black"
                        />
                      )}
                      renderItem={renderEmpItem}
                    />
                  </VStack>
                  <Spacer />
                  <Button
                    h="16"
                    mt="4"
                    flex="1"
                    justifyContent="center"
                    alignItems="center"
                    colorScheme="emerald"
                    _text={{ fontSize: 24 }}
                    onPress={() => {
                      filterZeroQuantity();
                    }}
                  >
                    ยืนยัน
                  </Button>
                </HStack>
                <Collapse isOpen={error != ""}>
                  <Text fontSize={18} color="altred.400">
                    {error}
                  </Text>
                </Collapse>
              </>
            )}
          </VStack>
        </Modal.Content>
      </Modal>
    </>
  );
};

const ConfirmDialog = ({
  isOpen,
  setIsOpen,
  postData,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  postData: () => void;
}) => {
  const onClose = () => {
    setIsOpen(false);
  };
  const onConfirm = () => {
    postData();
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

export default StuffWithdraw;
const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#f4f4f4",
    height: 50,
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexGrow: 1,
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
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 1,
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
