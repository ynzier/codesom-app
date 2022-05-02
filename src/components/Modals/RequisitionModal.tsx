import React, { useEffect, useRef, useState, memo } from "react";
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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { MultiSelect, Dropdown } from "ynzier-react-native-element-dropdown";
import { TextInput } from "react-native-element-textinput";
const RequisitionModal = ({
  showRequest,
  setShowRequest,
}: {
  showRequest: boolean;
  setShowRequest: (boolean: boolean) => void;
  props?: any;
}) => {
  const { promiseInProgress: loadingList } = usePromiseTracker({
    area: "loadingList",
  });
  const { promiseInProgress: submitting } = usePromiseTracker({
    area: "submitting",
  });
  const [optionList, setOptionList] = useState<any>([]);
  const [empList, setEmpList] = useState([]);
  const [creator, setCreator] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [itemList, setItemList] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      await trackPromise(
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
          }, 3000);
        }),
        "loadingList"
      );
    };
    void fetch();

    return () => {};
  }, []);

  const addItemToList = (item: any) => {
    const selectedArray: any = [];
    item.forEach((element: any) => {
      const index = itemList.findIndex((e: any) => e.key === element);
      if (index > -1) selectedArray.push(itemList[index]);
      else {
        optionList.find((entry: any) => {
          if (element == entry.key) selectedArray.push(entry);
        });
      }
    });
    setItemList(selectedArray);
  };
  const handleQuantityChange = (text: any, key: any) => {
    if (text) {
      const index = itemList.findIndex((obj: any) => obj.key == key);
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
  const getItemQuantity = (item: any) => {
    if (itemList.length) {
      const index = itemList.findIndex((obj: any) => obj.key == item.key);

      return itemList[index].quantity;
    }
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
    const sendData = {
      reqHeader: {
        creatorId: creator,
        itemCount: itemList.length,
      },
      requisitionItems: itemList,
    };
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            requisitionService
              .createReqApp(sendData)
              .then((res) => {
                if (res) {
                  setError("");
                  cleanUp();
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    textBody: "ทำรายการสำเร็จ",
                  });
                  setShowRequest(false);
                }
              })
              .catch((error) => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                setError(resMessage);
              })
          );
        }, 2000);
      }),
      "submitting"
    );
  };
  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <Text style={styles.selectItemType}>({item.type})</Text>
      </View>
    );
  };
  const renderEmpItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text>{item.label}</Text>
      </View>
    );
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        postData={postData}
        submitting={submitting}
      />
      <Modal
        isOpen={showRequest}
        onClose={() => {
          setSelected([]);
          setItemList([]);
          setShowRequest(false);
        }}
      >
        <Modal.Content h="700" maxWidth="600" borderRadius="40">
          <Modal.CloseButton mr="4" mt="2" />
          <VStack mt="8" mx="16">
            <Box h="16">
              <Text textAlign="center" fontWeight={600} fontSize="md">
                เพิ่มวัตถุดิบ
              </Text>
            </Box>
            {loadingList ? (
              <Spinner size="lg" color="cream" />
            ) : (
              <>
                <HStack mb="3">
                  <Text flex="1" fontWeight={600}>
                    รายการวัตถุดิบ
                  </Text>
                  <Pressable onPress={cleanUp}>
                    <MaterialIcons
                      name="cleaning-services"
                      size={18}
                      color="black"
                      style={{ transform: [{ rotate: "30deg" }] }}
                    />
                  </Pressable>
                </HStack>

                <ScrollView _android={{ minH: 300 }} _ios={{ minH: 400 }}>
                  <MultiSelect
                    style={styles.dropdown}
                    fontFamily="Prompt-Regular"
                    iconStyle={styles.iconStyle}
                    data={optionList}
                    labelField="name"
                    showsVerticalScrollIndicator
                    valueField="key"
                    placeholder="เลือกสินค้า..."
                    value={selected}
                    search
                    searchPlaceholder="Search..."
                    onChange={(item) => {
                      addItemToList(item);
                      setSelected(item);
                    }}
                    renderLeftIcon={() => (
                      <Ionicons name="cube" style={styles.icon} color="black" />
                    )}
                    renderItem={renderItem}
                    renderSelectedItem={(item, unSelect: any) => {
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
                              value={getItemQuantity(item)}
                              maxLength={3}
                              placeholder="0"
                              onChangeText={(text) => {
                                const count = parseInt(text);
                                handleQuantityChange(count, item.key);
                              }}
                            />
                            <Text>{item.unit}</Text>
                            <Ionicons
                              name="trash-bin-sharp"
                              style={styles.selectedIcon}
                              onPress={() => {
                                unSelect && unSelect(item);
                                const filtered = itemList.filter(
                                  (obj: any) => obj.key != item.key
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
                    <Text mb="3">ลงชื่อผู้ขอเบิกคลังสินค้า</Text>
                    <Dropdown
                      style={styles.dropdown}
                      fontFamily="Prompt-Regular"
                      iconStyle={styles.iconStyle}
                      data={empList}
                      search
                      maxHeight={200}
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
                    h="10"
                    justifyContent="center"
                    alignItems="center"
                    colorScheme="emerald"
                    alignSelf={"flex-end"}
                    onPress={filterZeroQuantity}
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
  submitting,
}: {
  isOpen: boolean;
  setIsOpen: (any: boolean) => void;
  postData: () => void;
  submitting: boolean;
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
              <Button
                colorScheme="emerald"
                onPress={onConfirm}
                isLoading={submitting}
              >
                ยืนยัน
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
};

export default memo(RequisitionModal);
const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#f4f4f4",
    height: 40,

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

  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: { width: 32, marginRight: 4, height: 32 },
  quantityText: { textAlign: "right", textDecorationLine: "underline" },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
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
    color: "#949494",
    marginRight: 4,
  },
  selectedIcon: { color: "#545454", fontSize: 18, marginLeft: 4 },
  selectItemType: { marginLeft: 8, fontSize: 16 },
  selectItemIcon: {
    marginRight: 5,
  },
});
