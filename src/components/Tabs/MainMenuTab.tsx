import { Box, Pressable, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { productService } from "services";

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
  const fetchProductType = (isSubscribed: boolean) => {
    productService
      .getAllProductTypes()
      .then((res) => {
        if (isSubscribed) {
          if (res) {
            const recData = res.data;
            setProductType(recData);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let isSubscribed = true;
    fetchProductType(isSubscribed);
    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      mx={3}
      borderColor="#B4B4B4"
    >
      <Box
        alignItems="center"
        paddingTop={2}
        width="40"
        borderBottomWidth={tabIndex == -1 ? 2 : 0}
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

              fontFamily: tabIndex == -1 ? "Prompt-Medium" : "Prompt-Regular",
            }}
          >
            สินค้าทั้งหมด
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
              paddingTop={2}
              zIndex={2}
              width="40"
              borderBottomWidth={tabIndex == item.typeId ? 2 : 0}
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
                    fontFamily:
                      tabIndex == item.typeId
                        ? "Prompt-Medium"
                        : "Prompt-Regular",
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
