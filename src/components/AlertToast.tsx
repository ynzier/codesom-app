import React from "react";
import { Box, Toast } from "native-base";

const AlertToast = () => {
  Toast.show({
    title: "Account verified",
    status: "success",
    description: "Thanks for signing up with us.",
    placement: "top-right",
    render: () => {
      return (
        <Box bg="teal.500" px={4} py={3} rounded="md" mb={5} mr={12}>
          Hi, Nice to see you ( ´ ∀ ` )ﾉ
        </Box>
      );
    },
  });
};
export default AlertToast;
