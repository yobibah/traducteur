import { Feather, Ionicons } from "@expo/vector-icons";
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
import Aiservice from "../../lib/aiService";
import { createTable, insertion } from "../../lib/database";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "../../lib/speechRecognition";
import Header from "../hooks/header";

const LANG_MAP: Record<string, string> = {
  Français: "fr-FR",
  Anglais: "en-US",
  Espagnol: "es-ES",
  Arabe: "ar-SA",
  Portugais: "pt-PT",
  Allemand: "de-DE",
  Dioula: "fr-FR", // fallback
  Mooré: "fr-FR", // fallback
};

const Home = () => {
  useEffect(() => {
    createTable();
  }, []);

  const width = Dimensions.get("screen").width * 0.9;

  const [text, setText] = useState("");
  const [activeMic, setActiveMic] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fromLang, setFromLang] = useState("Français");
  const [toLang, setToLang] = useState("Dioula");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useSpeechRecognitionEvent("result", (event) => {
    setText(event.results[0]?.transcript ?? "");
  });

  useSpeechRecognitionEvent("end", () => {
    setActiveMic(false);
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log(" Erreur micro :", event.error, event.message);
    setActiveMic(false);
  });

  const handleClearAll = () => {
    setText("");
    setResult(null);
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await Aiservice({
        message: text,
        langueActuel: fromLang,
        langueCible: toLang,
      });

      if (!res || !res.sortie || res.sortie === "Erreur") return;

      setResult(res);
      await insertion({
        message: text,
        langueActuel: fromLang,
        langueCible: toLang,
        sortie: res.sortie,
        allocution: res.allocution || "",
        exemple: res.exemple || "",
      });
    } catch (err) {
      console.log(" Erreur translate :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMicPress = async () => {
    if (activeMic) {
      ExpoSpeechRecognitionModule.stop();
      setActiveMic(false);
      return;
    }

    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      console.log("Permission refusée");
      return;
    }

    setText("");
    setResult(null);
    setActiveMic(true);

    ExpoSpeechRecognitionModule.start({
      lang: LANG_MAP[fromLang] ?? "fr-FR",
      interimResults: true,
      continuous: false,
    });
  };

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
            onBlur={() => setFocused(false)}
          />

          {/* Indicateur écoute */}
          {activeMic && (
            <View className="absolute bottom-10 left-3 flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-red-500" />
              <Text className="text-red-500 text-xs">Écoute...</Text>
            </View>
          )}

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

        {/* BOUTON TRADUIRE */}
        <TouchableOpacity
          onPress={handleTranslate}
          className="bg-orange-400 p-4 self-center rounded-md items-center"
          style={{ width }}
        >
          <Text className="text-white font-bold text-xl">
            {loading ? "Traduction..." : "Traduire"}
          </Text>
        </TouchableOpacity>

        {/* RÉSULTAT */}
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
