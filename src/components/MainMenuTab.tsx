import { Box, Pressable, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import ProductService from "../services/product.service";

interface productType {
  typeId: number;
  typeName: string;
}
const MainMenuTab = ({
  tabIndex,
  setTabIndex,
}: {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
}) => {
  const [productType, setProductType] = useState<productType[]>([]);
  useEffect(() => {
    ProductService.getAllProductTypes()
      .then((res) => {
        if (res) {
          const recData = res.data;
          setProductType(recData);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {};
  }, []);
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      ml="2"
      borderBottomWidth={1}
      mr="2"
      borderColor="#B4B4B4"
    >
      <Box
        alignItems="center"
        p="4"
        zIndex={2}
        width="40"
        borderBottomWidth={tabIndex == -1 ? 3 : 0}
        borderBottomColor={tabIndex == -1 ? "#9D7463" : "#B4B4B4"}
      >
        <Pressable
          onPress={() => {
            setTabIndex(-1);
          }}
        >
          <Animated.Text
            style={{
              color: "#000",
              fontSize: 18,
              fontFamily: tabIndex == -1 ? "Mitr-Medium" : "Mitr-Regular",
            }}
          >
            สินค้าขายดี
          </Animated.Text>
        </Pressable>
      </Box>
      {productType &&
        productType.map((item: productType) => {
          const borderColor = tabIndex == item.typeId ? "#9D7463" : "#B4B4B4";
          return (
            <Box
              key={item.typeId}
              alignItems="center"
              p="4"
              zIndex={2}
              width="40"
              borderBottomWidth={tabIndex == item.typeId ? 3 : 0}
              borderBottomColor={borderColor}
            >
              <Pressable
                onPress={() => {
                  setTabIndex(item.typeId);
                }}
              >
                <Animated.Text
                  style={{
                    color: "#000",
                    fontSize: 18,
                    fontFamily:
                      tabIndex == item.typeId ? "Mitr-Medium" : "Mitr-Regular",
                  }}
                >
                  {item.typeName}
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
    </ScrollView>
  );
};

export default MainMenuTab;
