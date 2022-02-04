import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceStorage = {
  async setToken(value: string): void {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("accessToken", jsonValue);
    } catch (e) {
      // save error
    }
  },
  async getToken(): string {
    try {
      const jsonValue = await AsyncStorage.getItem("accessToken");
      console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }

    alert("Done.");
  },
  async loadJWT(): string {
    try {
      const jsonValue = await AsyncStorage.getItem("accessToken");

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }
  },
  async deleteJWT() {
    try {
      await AsyncStorage.removeItem("accessToken").then(() => {
        console.log("log out");
      });
    } catch (error) {
      console.log("AsyncStorage Error: " + error.message);
    }
  },
};

export default deviceStorage;
