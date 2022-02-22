import React from "react";
import {
  Box,
  CheckIcon,
  HStack,
  Text,
  Toast,
  WarningTwoIcon,
} from "native-base";

const AlertToast = (
  description: string | undefined,
  status?: string | undefined
) => {
  let icon: any;
  let color: string;

  switch (status) {
    case "success":
      icon = <CheckIcon size="5" mt="0.5" color="tertiary.600" />;
      color = "tertiary.300";
      break;
    case "alert":
      icon = <WarningTwoIcon size="5" mt="0.5" color="rose.600" />;
      color = "rose.100";
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
          <HStack space={4} w="100%" pr="8" alignItems='center'>
            {icon}
            <Text noOfLines={5} fontWeight="light" fontSize="md">
              {description}
            </Text>
          </HStack>
        </Box>
      );
    },
  });
};
export default AlertToast;
