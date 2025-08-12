const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");

const defaultConfig = mergeConfig(getDefaultConfig(__dirname), {
  resetCache: true,
});

const reanimatedConfig = wrapWithReanimatedMetroConfig(defaultConfig);
const nativeWindConfig = withNativeWind(reanimatedConfig, { input: "./global.css" });

module.exports = nativeWindConfig;
