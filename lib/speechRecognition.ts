import { Platform } from "react-native";

const isNative = Platform.OS !== "web";

let ExpoSpeechRecognitionModule: any;
let useSpeechRecognitionEvent: any;

if (isNative) {
  try {
    const mod = require("expo-speech-recognition");
    ExpoSpeechRecognitionModule = mod.ExpoSpeechRecognitionModule;
    useSpeechRecognitionEvent = mod.useSpeechRecognitionEvent;
  } catch {
    // Expo Go — module natif absent
    ExpoSpeechRecognitionModule = {
      start: () => {},
      stop: () => {},
      requestPermissionsAsync: async () => ({ granted: false }),
    };
    useSpeechRecognitionEvent = (_event: string, _cb: any) => {};
  }
} else {
  ExpoSpeechRecognitionModule = {
    start: () => {},
    stop: () => {},
    requestPermissionsAsync: async () => ({ granted: false }),
  };
  useSpeechRecognitionEvent = (_event: string, _cb: any) => {};
}

export { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent };
