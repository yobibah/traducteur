import { Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import Header from "../hooks/header";

const Home = () => {
  const width = Dimensions.get("screen").width * 0.9;
  const [TextNt, setTextNt] = useState("");
  const [activeMic, setActiveMic] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [focused, setFocused] = useState(false);

  const handleClearAll = () => setTextNt("");

  const handleMicPress = async () => {
    setActiveMic(!activeMic);

    if (!activeMic) {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );
        await recording.startAsync();
        setRecording(recording);
      } catch (err) {
        console.log("Erreur démarrage enregistrement :", err);
      }
    } else {
      // Stop et lecture
      try {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Audio enregistré :", uri);

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
        );
        setSound(sound);

        setRecording(null);
      } catch (err) {
        console.log("Erreur stop enregistrement :", err);
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <ScrollView className="flex1" showsVerticalScrollIndicator>
        <View
          className={`shadow-md bg-white self-center my-10 rounded-xl p-2 ${focused ? "border border-orange-300" : ""}`}
          style={{ width }}
        >
          <TouchableOpacity
            className="absolute right-3 top-3 bg-slate-100 rounded-full p-1"
            onPress={handleClearAll}
          >
            <Ionicons name="close" size={20} color="#6a7282" />
          </TouchableOpacity>

          <TextInput
            placeholder="Mots ou phrase à traduire..."
            multiline
            numberOfLines={8}
            value={TextNt}
            onChangeText={setTextNt}
            className="text-base"
            style={{
              minHeight: 180,
              textAlignVertical: "top",
              paddingRight: 50,
              paddingBottom: 30,
            }}
            onPress={() => setFocused(!focused)}
          />

          <TouchableOpacity
            className={`absolute right-3 bottom-3 rounded-full p-2 transition-transform ${
              activeMic
                ? "bg-orange-100 animate-pulse scale-110"
                : "bg-slate-100 scale-100"
            }`}
            onPress={handleMicPress}
          >
            <Feather
              name="mic"
              size={20}
              color={activeMic ? "#fb2c36" : "#6a7282"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-orange-400  -pt-5 p-4 self-center rounded-md justify-center items-center"
          style={{ width }}
        >
          <Text className="text-white font-bold text-xl">Traduire</Text>
        </TouchableOpacity>

        <View
          className="shadow-md bg-white self-center my-10 rounded-xl p-4 border border-orange-300 "
          style={{ width }}
        >
          <View className="flex-row justify-between ">
            <Text className="text-orange-500 text-lg">Dioula</Text>
            <TouchableOpacity>
              <Feather name="star" size={20} color="#fb2c36" />
            </TouchableOpacity>
          </View>
          <Text className="text-3xl font-bold">I ni sogoma</Text>
          <Text className="text-gray-500">/ee nee so-go-ma/</Text>

          <View className="flex-row py-6 items-center justify-stretch gap-5 ">
            <TouchableOpacity className="flex-row gap-2 bg-orange-100 p-2 rounded-full">
              <Feather name="volume-2" size={20} color="#ff6900" />
              <Text className="text-orange-500">ecouter</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row">
              <Feather name="copy" size={20} color="#6a7282" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row">
              <Feather name="share" size={20} color="#6a7282" />
            </TouchableOpacity>
          </View>
          <View className="h-[1] bg-gray-300"></View>

          <View className="flex-row gap-2 p-4 ">
            <View className="w-[4] bg-orange-500 rounded-full"></View>
            <Text className="font-bold">Exemple d'utilisations</Text>
          </View>

          <View className="shadow-md bg-gray-100 rounded-lg p-4">
            <Text className="font-medium">Bonjour comment aller-vous?</Text>
            <Text className="text-orange-500">I ni sogoma, i ka kɛnɛ wa?</Text>
          </View>

          <View className="shadow-md bg-gray-100 rounded-lg p-4 my-4">
            <Text className="font-medium">Bonjour tout le monde</Text>
            <Text className="text-orange-500">Aw ni sogoma.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
