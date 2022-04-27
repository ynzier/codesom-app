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
        }
      });
    } catch (error) {
      console.log("error2:", error);
    }
  },
  async deleteJWT() {
    await AsyncStorage.removeItem("accessToken");
  },
  async setBranchInfo(value: string): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("branchInfo", jsonValue);
  },
};

export default deviceStorage;
