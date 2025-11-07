# NutriLens AI - CalCalc

An AI-powered nutrition tracking mobile app that uses computer vision to automatically recognize food and provide detailed nutritional information.

## 📱 Features

- **📸 Smart Food Recognition** - Capture photos of meals and automatically identify food items
- **🔢 Detailed Nutrition Analysis** - Get comprehensive breakdown of calories, carbs, protein, and fats
- **⚡ Health Score Calculation** - Instant nutritional quality assessment (0-10 scale)
- **🍽️ Multi-Item Detection** - Recognize multiple food items in a single photo
- **📊 Portion Adjustment** - Easily scale nutrition data by adjusting serving size
- **📜 Meal History** - Track all your meals with searchable history
- **🎯 Meal Categorization** - Automatic categorization (Breakfast, Lunch, Dinner, Snack)

## 🛠 Technology Stack

- **React Native** 0.71.4 - Cross-platform mobile development (iOS & Android)
- **TypeScript** - Type-safe development
- **React Navigation** - Seamless navigation between screens
- **React Native Vision Camera** - High-performance camera integration
- **React Native SVG** - Scalable vector graphics
- **Context API** - Simple and effective state management
- **Mock AI Services** - Food recognition and nutrition data (ready for API integration)

## 📋 Prerequisites

Before running this app, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **React Native development environment** set up:
  - For iOS: Xcode 12+ (macOS only)
  - For Android: Android Studio with SDK
- **CocoaPods** (for iOS dependencies)

### Setting Up React Native Environment

Follow the official guide: [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CalCalc
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Run the Application

#### For iOS:
```bash
npm run ios
# or
npx react-native run-ios
```

#### For Android:
```bash
npm run android
# or
npx react-native run-android
```

#### Start Metro Bundler (if not started automatically):
```bash
npm start
# or
npx react-native start
```

## 📁 Project Structure

```
CalCalc/
├── src/
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Core data types and interfaces
│   ├── context/            # State management
│   │   └── AppContext.tsx  # Global app state and meal storage
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/            # Screen components
│   │   ├── CameraScreen.tsx    # Food scanning screen
│   │   ├── ResultsScreen.tsx   # Nutrition analysis screen
│   │   └── HistoryScreen.tsx   # Meal history screen
│   ├── services/           # Business logic and API services
│   │   ├── foodRecognitionService.ts  # Food detection (mock/API ready)
│   │   └── nutritionService.ts        # Nutrition data (mock/API ready)
├── android/                # Android native code
├── ios/                    # iOS native code
├── public/                 # Static assets
│   └── prototype.html      # UI design prototype
├── App.tsx                 # Main app entry point
├── index.js                # React Native entry
├── tsconfig.json           # TypeScript configuration
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
└── package.json            # Dependencies and scripts
```

## 🎯 How to Use

### 1. Scan Food
- Open the app (starts on Camera screen)
- Point camera at your meal
- Tap the large white shutter button to capture

### 2. Review & Adjust
- View automatically detected food items
- Check nutritional breakdown
- Adjust portion size using +/- buttons
- Modify meal category if needed

### 3. Save to History
- Tap "Done" to save the meal
- Access history by tapping the bookmark icon on camera screen

## 🔌 API Integration Guide

The app is currently using mock data for development. To integrate with real APIs:

### Food Recognition (Google Cloud Vision API)

1. **Set up Google Cloud project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Vision API
   - Create API credentials

2. **Install dependencies**:
   ```bash
   npm install @google-cloud/vision
   ```

3. **Update** `src/services/foodRecognitionService.ts`:
   - Replace mock implementation with actual API calls
   - See inline comments in the file for integration example

### Nutrition Data (Edamam or USDA API)

1. **Sign up for API**:
   - [Edamam Nutrition API](https://www.edamam.com/)
   - Or [USDA FoodData Central](https://fdc.nal.usda.gov/)

2. **Install axios**:
   ```bash
   npm install axios
   ```

3. **Update** `src/services/nutritionService.ts`:
   - Replace mock data with API calls
   - See inline comments for integration example

## 🧪 Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 📱 Permissions

The app requires the following permissions:

### iOS (Info.plist)
- **Camera** - To capture food photos
- **Photo Library** - To analyze images from gallery

### Android (AndroidManifest.xml)
- **CAMERA** - To capture food photos
- **READ_EXTERNAL_STORAGE** - To access gallery
- **INTERNET** - For API calls

## 🐛 Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted in device settings
- For iOS: Check Info.plist has NSCameraUsageDescription
- For Android: Check AndroidManifest.xml has CAMERA permission

### Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### iOS Build Fails
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [ ] Real-time nutrition tracking dashboard
- [ ] Daily/weekly nutrition goals
- [ ] Barcode scanner for packaged foods
- [ ] Recipe suggestions based on nutrition goals
- [ ] Integration with fitness apps
- [ ] Social sharing features
- [ ] Meal planning calendar
- [ ] Export nutrition data to CSV/PDF

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

Built with ❤️ using React Native 