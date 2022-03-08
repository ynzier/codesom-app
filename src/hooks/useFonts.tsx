import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    "Mitr-Regular": require("../assets/fonts/Mitr-Regular.ttf"),
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-SemiBold": require("../assets/fonts/Prompt-SemiBold.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
    "Prompt-Light": require("../assets/fonts/Prompt-Light.ttf"),
    "Prompt-ExtraLight": require("../assets/fonts/Prompt-ExtraLight.ttf"),
  });
