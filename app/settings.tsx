import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
      <Text className="text-2xl font-sans font-medium text-root-earth">Settings</Text>
      <Text className="text-base text-deep-bark font-sans mt-2">Settings screen coming soon.</Text>
    </SafeAreaView>
  );
}
