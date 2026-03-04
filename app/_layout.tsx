import { Stack } from "expo-router";
import { Dimensions, StatusBar } from "react-native";
export default function RootLayout() {
  const widthL = Dimensions.get("window").width * 0.8;
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "#e17100" },
          headerTintColor: "#e17100",
          headerBackVisible: true,
        }}
      />
      <StatusBar backgroundColor="#000" />
    </>
  );
}
