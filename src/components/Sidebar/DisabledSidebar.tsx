/* eslint-disable indent */
import React, { useState, useCallback } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
  Divider,
  FlatList,
} from "native-base";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/th"; // ES 2015

dayjs.extend(localizedFormat);

const DisabledSidebar: React.FC = () => {
  return (
    <>
      <HStack
        w="100%"
        flex="1"
        bg="#FFF0D9"
        opacity={0.5}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={24}>ไม่พร้อมใช้งานในหน้านี้</Text>
      </HStack>
    </>
  );
};

export default DisabledSidebar;
