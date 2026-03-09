import { Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
    Dimensions,
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

      <View
        className={`shadow-md bg-white self-center my-20 rounded-xl p-2 ${focused ? "border border-orange-300" : ""}`}
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
    </SafeAreaView>
  );
};

export default Home;
