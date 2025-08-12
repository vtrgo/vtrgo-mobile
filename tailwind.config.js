/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./Components/NativeWind.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

