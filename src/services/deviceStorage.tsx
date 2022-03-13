import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceStorage = {
  async setToken(value: string): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("accessToken", jsonValue);
      return;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  async loadJWT(): Promise<string | void> {
    try {
      await AsyncStorage.getItem("accessToken", (error: any, result: any) => {
        if (result) {
          return JSON.stringify(result);
        } else {
          console.log("error1:", JSON.stringify(error));
          return;
        }
      });
    } catch (error) {
      console.log("error2:", error);
    }
  },
  async deleteJWT() {
    try {
      await AsyncStorage.removeItem("accessToken").then(() => {
        console.log("log out");
      });
    } catch (error) {
      console.log("AsyncStorage Error: " + error);
      throw error;
    }
  },
  async setBranchInfo(value: string): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("branchInfo", jsonValue);
    } catch (e) {
      console.log("AsyncStorage Error: " + e);
    }
  },
};

export default deviceStorage;
