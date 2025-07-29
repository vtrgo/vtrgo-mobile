#React Native NFC Dashboard App

This project is a React Native app that reads NFC tags and displays binary data from an industrial PLC system in a user-friendly dashboard. It is built with the **React Native CLI** and runs on **physical Android or iOS devices**.

---

## 📦 Features

- 🔍 Reads binary NDEF data via NFC
- 📊 Visualizes PLC values using charts and labels
- 📱 Cross-platform: Android + iOS support
- ⚡ Fast Refresh for efficient development

---

## 🛠 React Native CLI Setup (No Expo)

This app uses **React Native CLI** and must be run on a **real device** — NFC does not work in emulators.

### 1. Prerequisites

Make sure the following tools are installed:

- [Node.js (LTS version)](https://nodejs.org/)
- [Java Development Kit (JDK 11+)](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio](https://developer.android.com/studio) (for SDK & platform tools)
- [Xcode](https://developer.apple.com/xcode/) (macOS only, for iOS builds)
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (iOS only)

---

### 2. Physical Device Setup

#### Android

- Enable **Developer Options** on your phone
- Turn on **USB Debugging**
- Connect your phone via USB and accept any permissions
- Verify connection:
  ```sh
  adb devices
  ```

#### iOS (macOS only)

- Open the Xcode workspace:
  ```sh
  open ios/YourAppName.xcworkspace
  ```
- Connect your iPhone via USB
- Select it as the run target in Xcode
- Ensure a valid team is selected for signing (Xcode > Preferences > Accounts)

---

### 3. Install and Run the App

Clone the project and install dependencies:

```sh
git clone https://github.com/Jon-Hincks/VTR_Scanner_React.git
cd VTR_Scanner_React
yarn install        # or npm install
```

If you're on macOS targeting iOS:

```sh
cd ios
pod install
cd ..
```

Install app:

```sh
cd android
Gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk

```

---

## 📲 How to Use

1. Launch the app on your phone (not emulator)
2. Scan an NFC tag that contains PLC data
3. The app will read and parse the data
4. View it on a clean dashboard with charts and labels

> ⚠️ NFC requires a real phone with hardware support — emulators will not work.

---

