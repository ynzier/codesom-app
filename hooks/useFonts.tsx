import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    "Mitr-Regular": require("../assets/fonts/Mitr-Regular.ttf"),
    "Mitr-Bold": require("../assets/fonts/Mitr-Bold.ttf"),
    "Mitr-SemiBold": require("../assets/fonts/Mitr-SemiBold.ttf"),
    "Mitr-Light": require("../assets/fonts/Mitr-Light.ttf"),
  });
