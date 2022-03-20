import {
  Image,
  Text,
  FlatList,
  Box,
  VStack,
  Button,
  Center,
  View,
  HStack,
} from "native-base";
import React, { useState, useCallback } from "react";
import { ALERT_TYPE, Toast } from "alert-toast-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { storageService, promotionService } from "services";
import RecipeModal from "../Modals/RecipeModal";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015
import NumberFormat from "react-number-format";

const numColumns = 2;
const PromotionList = ({
  cartData,
  setCartData,
}: {
  cartData: any;
  setCartData: (value: any) => void;
}) => {
  const { promiseInProgress } = usePromiseTracker();

  const [recipeOpen, setRecipeOpen] = useState(false);
  const [recipeId, setRecipeId] = useState<any>();
  const [promoData, setPromoData] = useState<any[]>([]);
  const ErrorImg =
    "data:image/png;base64,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";

  // const isInCart = (itemId: number) => {
  //   if (
  //     cartData.filter((e: { prId: number }) => e.prId === itemId).length > 0
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  // const addToCart = (item) => {
  //   setCartData((prev: any) => [...prev, item]);
  // };
  const fetchPromo = (isSubscribed: boolean) => {
    void trackPromise(
      promotionService
        .getAllPromotion()
        .then((res) => {
          if (isSubscribed) {
            if (res) {
              const recData = res.data;
              setPromoData(recData);
            }
          }
        })
        .catch((error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          Toast.show({
            type: ALERT_TYPE.DANGER,
            textBody: resMessage,
          });
        })
    );
  };
  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;
      fetchPromo(isSubscribed);

      return () => {
        setPromoData([]);
        isSubscribed = false;
      };
    }, [])
  );

  const formatData = (data: any[], numColumns: number) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <HStack style={styles.item}>
        <Box style={styles.imageContainer}>
          <Image
            style={styles.itemImage}
            alt={item.promoName}
            src={item.image?.imgObj != null ? item.image.imgObj : ErrorImg}
          />
        </Box>
        <Box style={styles.textBox}>
          <Text fontWeight={700} fontSize="md" ellipsizeMode="tail" numberOfLines={1}>
            {item.promoName}
          </Text>
          <Text ellipsizeMode="tail" numberOfLines={2}>
            {item.promoDetail}
          </Text>
          <Text color="light.500">
            เริ่มต้น:{" "}
            {dayjs(item.promoStart).locale("th").format("D MMMM YYYY ")}
          </Text>
          <Text color="light.500">
            สิ้นสุด: {dayjs(item.promoEnd).locale("th").format("D MMMM YYYY ")}
          </Text>
          <Box style={styles.footerText}>
            <NumberFormat
              value={item.promoPrice}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale
              renderText={(formattedValue) => (
                <Text textAlign="right">ราคา: {formattedValue} บาท</Text>
              )}
            />
          </Box>
        </Box>
      </HStack>
    );
  };
  return (
    <>
      {recipeOpen && (
        <RecipeModal
          recipeOpen={recipeOpen}
          setRecipeOpen={setRecipeOpen}
          recipeId={recipeId}
        />
      )}
      <Box alignSelf="center" w="100%">
        <FlatList
          numColumns={numColumns}
          onRefresh={() => {
            fetchPromo(true);
          }}
          refreshing={promiseInProgress}
          data={formatData(promoData, numColumns)}
          keyExtractor={(item: any) => item.promoId}
          renderItem={renderItem}
        />
      </Box>
    </>
  );
};
export default PromotionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    margin: 16,
    height: Dimensions.get("window").width / 6, // approximate a square
    padding: Dimensions.get("window").width / 84,
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#000",
  },
  imageContainer: { flex: 3 },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  textBox: {
    flex: 4,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  footerText: {
    width: "100%",
    position: "absolute", //Here is the trick
    bottom: 12, //Here is the trick
  },
});
