const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Fix expo-sqlite sur web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName.includes("expo-sqlite")) {
    return { type: "empty" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// ✅ Fix NativeWind sur web
module.exports = withNativeWind(config, { input: "./global.css" });
