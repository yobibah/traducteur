import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Dimensions, Pressable, Text, View } from "react-native";
import "../../global.css";

export default function Header() {
  const width = Dimensions.get("screen").width * 0.9;

  return (
    <View className="bg-[#e17100] h-[150px] rounded-b-xl">
      <View className="flex-row">
        <View className="flex-row p-2.5">
          <View className="bg-[#ff8904] justify-center rounded-md">
            <Text className="text-white font-bold text-xl p-1.5">T</Text>
          </View>

          <Text className="text-white font-bold text-xl p-1.5">Traducteur</Text>
        </View>

        <Pressable
          className="bg-[#ff8904] justify-center rounded-full absolute right-1 top-2"
          onPress={() => console.log("homme presser")}
        >
          <Ionicons
            name="settings-outline"
            size={19}
            color="#fff"
            style={{ padding: 10 }}
          />
        </Pressable>
      </View>

      <View
        style={{ width }}
        className="bg-white rounded-lg p-3 self-center flex-row justify-between"
      >
        <Pressable className="self-center flex-row items-center gap-1">
          <Text>Anglais</Text>
          <Ionicons name="chevron-up-outline" />
        </Pressable>

        <Pressable
          onPress={() => console.log("echnager")}
          className="shadow-md bg-orange-100 rounded-full h-10 w-10 justify-center items-center "
        >
          <FontAwesome6
            name="arrow-right-arrow-left"
            size={20}
            color="#e17100"
          />
        </Pressable>

        <Pressable className="self-center flex-row items-center gap-1 bg-[#ff8904] rounded-lg">
          <Text className="text-white p-1.5">Francais</Text>
          <Ionicons
            name="chevron-up-outline"
            color="#fff"
            style={{ paddingRight: 3 }}
          />
        </Pressable>
      </View>
    </View>
  );
}
