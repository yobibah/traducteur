import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
import "../../global.css";

export default function HistoriqueHeader() {
  const width = Dimensions.get("screen").width * 0.9;

  return (
    <View className="bg-[#e17100] h-[100px] rounded-b-xl">
      <View className="flex-row">
        <View className="flex-row p-2.5">
          <View className="bg-[#ff8904] justify-center rounded-md">
            <Text className="text-white font-bold text-xl p-1.5">T</Text>
          </View>

          <Text className="text-white font-bold text-xl p-1.5">Traducteur</Text>
        </View>

        <Pressable
          className="bg-[#ff8904] justify-center rounded-full absolute right-1 top-2"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Feather name="home" size={19} color="#fff" style={{ padding: 10 }} />
        </Pressable>
      </View>
    </View>
  );
}
