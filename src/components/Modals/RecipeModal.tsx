import React, { useCallback, useState } from "react";
import {
  Box,
  Center,
  HStack,
  Modal,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { productService } from "services";
import { StyleSheet } from "react-native";

const RecipeModal = ({
  recipeOpen,
  setRecipeOpen,
  recipeId,
}: {
  recipeOpen: boolean;
  setRecipeOpen: (a: boolean) => void;
  recipeId: any;
}) => {
  const [recipeData, setRecipeData] = useState<any>({});
  const [ingrArray, setIngrArray] = useState([]);
  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;

      const fetchRecipeData = () => {
        productService
          .getRecipeByIdIncStorage(recipeId)
          .then((res) => {
            if (isSubscribed) {
              setRecipeData(res.data.recipeData);
              setIngrArray(res.data.recipeData.recipe_ingredients);
            }
          })
          .catch((err) => console.log(err));
      };
      fetchRecipeData();

      return () => {
        isSubscribed = false;
      };
    }, [recipeId])
  );
  return (
    <Center>
      <Modal
        size="lg"
        isOpen={recipeOpen}
        onClose={() => {
          setRecipeOpen(false);
        }}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body px="12" py="4">
            <Box my="4">
              <Text style={styles.headerText}>การผสม</Text>
              <Text style={styles.description}>
                ชื่อสินค้า: {recipeData && recipeData.productName}
              </Text>
              <Text mt={2} style={styles.description}>
                คำอธิบาย: {recipeData && recipeData.description}
              </Text>
            </Box>
            <Box bg="light.300" h="0.5" mb="4" />
            <Text alignSelf="center" style={styles.headerText}>
              วัตถุดิบที่ใช้
            </Text>
            <ScrollView h="400">
              {ingrArray &&
                ingrArray.map((obj: any) => {
                  if (!obj.instock) obj.instock = "ไม่เหลือ";
                  else
                    obj.instock = obj.instock + " " + obj.ingredient.ingrUnit;
                  return (
                    <Box
                      key={obj.ingredient.ingrId}
                      borderRadius={24}
                      mx="4"
                      w="100%"
                      h="16"
                      mb="2"
                      alignSelf="center"
                      flexDirection="row"
                      borderBottomWidth={1}
                      borderColor="light.300"
                    >
                      <Box flex="1" alignItems="center" justifyContent="center">
                        <Text fontSize="lg">{obj.ingredient.ingrName}</Text>
                      </Box>
                      <Box flex="1" justifyContent="center" pl="8">
                        <Text>
                          ที่ใช้: {obj.amountRequired} {obj.ingredient.ingrUnit}
                        </Text>
                        {obj.instock == "ไม่เหลือ" ? (
                          <Text>
                            คงเหลือ:
                            <Text color="red.500"> หมด</Text>
                          </Text>
                        ) : (
                          <Text>คงเหลือ: {obj.instock}</Text>
                        )}
                      </Box>
                    </Box>
                  );
                })}
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default RecipeModal;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 16,
  },
  description: { fontSize: 18, lineHeight: 24 },
});
