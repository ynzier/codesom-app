import React from "react";
import {
  Box,
  CheckIcon,
  HStack,
  Text,
  Toast,
  WarningIcon,
  WarningTwoIcon,
} from "native-base";

const AlertToast = (
  description: string | undefined,
  status?: string | undefined
) => {
  let icon: any;
  let fontcolor: string;
  let color: string;

  switch (status) {
    case "success":
      fontcolor = "light.800";
      icon = <CheckIcon size="5" mt="0.5" color={fontcolor} />;
      color = "tertiary.300";
      break;
    case "alert":
      fontcolor = "light.100";
      icon = <WarningTwoIcon size="5" mt="0.5" color={fontcolor} />;
      color = "#E53455";
      break;
    case "warning":
      fontcolor = "light.100";
      icon = <WarningIcon size="5" mt="0.5" color={fontcolor} />;
      color = "#AE5302";
      break;
  }

  Toast.show({
    placement: "top-right",
    render: () => {
      return (
        <Box
          bg={color}
          w={{ md: 300, xl: 400 }}
          px={4}
          py={3}
          rounded="md"
          mb={5}
          mr={12}
        >
          <HStack space={4} w="100%" pr="8" alignItems="center">
            {icon}
            <Text noOfLines={5} fontWeight="light" color={fontcolor}>
              {description}
            </Text>
          </HStack>
        </Box>
      );
    },
  });
};
export default AlertToast;
