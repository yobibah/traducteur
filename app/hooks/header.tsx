import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import "../../global.css";
import { langues } from "../data/langue";

export default function Header({
  fromLang,
  toLang,
  setFromLang,
  setToLang,
}: any) {
  const width = Dimensions.get("screen").width * 0.9;

  const [visible, setVisible] = useState(false);
  const [target, setTarget] = useState("from");

  const selectLang = (lang: string) => {
    if (target === "from") {
      setFromLang(lang);
    } else {
      setToLang(lang);
    }
    setVisible(false);
  };

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
          onPress={() => router.push("/(tabs)/home")}
        >
          <Feather name="home" size={19} color="#fff" style={{ padding: 10 }} />
        </Pressable>
      </View>

      <View
        style={{ width }}
        className="bg-white rounded-lg p-3 self-center flex-row justify-between"
      >
        {/* FROM */}
        <Pressable
          onPress={() => {
            setTarget("from");
            setVisible(true);
          }}
          className="flex-row items-center gap-1"
        >
          <Text>{fromLang}</Text>
          <Ionicons name="chevron-up-outline" />
        </Pressable>

        {/* SWITCH */}
        <Pressable
          onPress={() => {
            const temp = fromLang;
            setFromLang(toLang);
            setToLang(temp);
          }}
          className="bg-orange-100 rounded-full h-10 w-10 justify-center items-center"
        >
          <FontAwesome6
            name="arrow-right-arrow-left"
            size={20}
            color="#e17100"
          />
        </Pressable>

        {/* TO */}
        <Pressable
          onPress={() => {
            setTarget("to");
            setVisible(true);
          }}
          className="flex-row items-center gap-1 bg-[#ff8904] rounded-lg"
        >
          <Text className="text-white p-1.5">{toLang}</Text>
          <Ionicons name="chevron-up-outline" color="#fff" />
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-4 rounded-t-xl max-h-[60%]">
            <FlatList
              data={langues}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => selectLang(item)}
                  className="p-4 border-b border-gray-200"
                >
                  <Text className="text-lg">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
