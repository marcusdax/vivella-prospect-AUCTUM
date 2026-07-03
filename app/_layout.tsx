import { Stack } from 'expo-router';
import '../src/design-system/global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'VIVELLA PROSPECT' }} />
    </Stack>
  );
}
