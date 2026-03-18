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
import Aiservice from "../services/aiService";
import { createTable, insertion } from "../services/HistoriqueService";

const Home = () => {
  // ✅ INIT DB UNE SEULE FOIS
  useEffect(() => {
    const init = async () => {
      await createTable();
    };
    init();
  }, []);

  const width = Dimensions.get("screen").width * 0.9;

  const [text, setText] = useState("");
  const [activeMic, setActiveMic] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [focused, setFocused] = useState(false);

  const [fromLang, setFromLang] = useState("Français");
  const [toLang, setToLang] = useState("Dioula");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ CLEAR
  const handleClearAll = () => {
    setText("");
    setResult(null);
  };

  // ✅ TRANSLATE
  const handleTranslate = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await Aiservice({
        message: text,
        langueActuel: fromLang,
        langueCible: toLang,
      });

      console.log("RES CLEAN :", res);

      // 🔒 VALIDATION
      if (!res || !res.sortie) {
        console.log("❌ Réponse invalide");
        return;
      }

      setResult(res);

      // ✅ INSERT DB
      await insertion({
        message: text,
        langueActuel: fromLang,
        langueCible: toLang,
        sortie: res.sortie,
        allocution: res.allocution || "",
        exemple: res.exemple || "",
      });
    } catch (err) {
      console.log("❌ Erreur translate :", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MICRO
  const handleMicPress = async () => {
    try {
      if (!activeMic) {
        setActiveMic(true);

        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const rec = new Audio.Recording();
        await rec.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );
        await rec.startAsync();

        setRecording(rec);
      } else {
        setActiveMic(false);

        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
        );

        setSound(sound);
        setRecording(null);
      }
    } catch (err) {
      console.log("❌ Erreur micro :", err);
    }
  };

  // ✅ CLEAN AUDIO
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <SafeAreaView className="flex-1">
      <Header
        fromLang={fromLang}
        toLang={toLang}
        setFromLang={setFromLang}
        setToLang={setToLang}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* INPUT */}
        <View
          className={`shadow-md bg-white self-center my-10 rounded-xl p-2 ${
            focused ? "border border-orange-300" : ""
          }`}
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
            value={text}
            onChangeText={setText}
            className="text-base"
            style={{
              minHeight: 180,
              textAlignVertical: "top",
              paddingRight: 50,
              paddingBottom: 30,
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)} // ✅ FIX important
          />

          <TouchableOpacity
            className={`absolute right-3 bottom-3 rounded-full p-2 ${
              activeMic ? "bg-orange-100" : "bg-slate-100"
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

        {/* BUTTON */}
        <TouchableOpacity
          onPress={handleTranslate}
          className="bg-orange-400 p-4 self-center rounded-md items-center"
          style={{ width }}
        >
          <Text className="text-white font-bold text-xl">
            {loading ? "Chargement..." : "Traduire"}
          </Text>
        </TouchableOpacity>

        {/* RESULT */}
        {result && (
          <View
            className="shadow-md bg-white self-center my-10 rounded-xl p-4 border border-orange-300"
            style={{ width }}
          >
            <Text className="text-orange-500 text-lg">{toLang}</Text>

            <Text className="text-3xl font-bold">{result.sortie}</Text>

            <Text className="text-gray-500">{result.allocution}</Text>

            <View className="h-[1] bg-gray-300 my-4" />

            <Text className="font-bold mb-2">Exemple d'utilisation</Text>

            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="font-medium">{text}</Text>
              <Text className="text-orange-500">{result.exemple}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
