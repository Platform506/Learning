import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1b5e20' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f7f7f2' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'ESS Cuadratura' }} />
        <Stack.Screen name="prices" options={{ title: 'Precios' }} />
        <Stack.Screen name="cash" options={{ title: 'Caja' }} />
        <Stack.Screen name="day-meters" options={{ title: 'Litros del día' }} />
        <Stack.Screen name="lunch-meters" options={{ title: 'Litros almuerzo' }} />
        <Stack.Screen name="quadrants" options={{ title: '4 Almuerzos' }} />
        <Stack.Screen name="review" options={{ title: 'Revisión' }} />
        <Stack.Screen name="result" options={{ title: 'Resultado' }} />
      </Stack>
    </>
  );
}
