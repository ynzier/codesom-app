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
import { employeeService, storageService } from "services";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
      }),
      "loadingList"
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
  const getItemQuantity = (item: any): void => {
    if (itemList.length) {
      const index = itemList.findIndex(
        (obj: any) => obj.stuffId == item.stuffId
      );
      return itemList[index].quantity;
    }
  };
  const filterZeroQuantity = () => {
    if (itemList.length < 1) return setError("?????????????????????????????????????????????????????????????????????????????????????????????");
    const filtered = itemList.find(
      (obj: any) => !obj.quantity || obj.quantity == 0
    );

    if (filtered) {
      return setError("??????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????");
    }
    if (!creator) return setError("????????????????????????????????????????????????????????????????????????????????????????????????????????????");

    setError("");
    return setIsOpen(true);
  };

  const postData = () => {
    const sendData = {
      reqHeader: {
        creatorId: creator,
        itemCount: itemList.length,
      },
      withDrawItems: itemList,
    };
    void trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            storageService
              .createWithdrawStuff(sendData)
              .then((res) => {
                if (res) {
                  setError("");
                  cleanUp();
                  Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    textBody: "??????????????????????????????????????????",
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
        submitting={submitting}
      />
      <Modal
        isOpen={showRequest}
        avoidKeyboard
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
                ?????????????????????????????????????????????
              </Text>
            </Box>
            {loadingList ? (
              <Spinner size="lg" color="cream" />
            ) : (
              <>
                <HStack mb="3">
                  <Text flex="1" fontWeight={600}>
                    ????????????????????????????????????????????????????????????
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
                    labelField="stuffName"
                    showsVerticalScrollIndicator
                    valueField="stuffId"
                    placeholder="?????????????????????????????????..."
                    value={selected}
                    onChange={(item) => {
                      addItemToList(item);
                      setSelected(item);
                    }}
                    renderLeftIcon={() => (
                      <Ionicons name="cube" style={styles.icon} color="black" />
                    )}
                    renderSelectedItem={(item, unSelect): any => {
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
                                if (count > item.itemRemain)
                                  handleQuantityChange(
                                    item.itemRemain,
                                    item.stuffId
                                  );
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
                    <Text mb="3">???????????????????????????????????????????????????????????????????????????</Text>
                    <Dropdown
                      style={styles.dropdown}
                      fontFamily="Prompt-Regular"
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={empList}
                      dropdownPosition="top"
                      maxHeight={200}
                      labelField="label"
                      valueField="value"
                      placeholder="?????????????????????????????????????????????????????????????????????"
                      searchPlaceholder="???????????????..."
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
                    w={32}
                    justifyContent="center"
                    alignItems="center"
                    colorScheme="emerald"
                    alignSelf={"flex-end"}
                    onPress={filterZeroQuantity}
                  >
                    ??????????????????
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
          <AlertDialog.Header>??????????????????</AlertDialog.Header>
          <AlertDialog.Body>????????????????????????????????????????????????????????????????????????????????????????????? ?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                ??????????????????
              </Button>
              <Button
                isLoading={submitting}
                colorScheme="emerald"
                onPress={onConfirm}
              >
                ??????????????????
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
