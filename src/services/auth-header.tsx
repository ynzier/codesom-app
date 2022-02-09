import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function authHeader(): Promise<string> {
  const accessToken = await AsyncStorage.getItem("accessToken");
  return accessToken as string;
}
