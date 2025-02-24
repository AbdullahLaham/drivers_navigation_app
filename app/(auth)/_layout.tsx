
import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import {Text} from 'react-native'

// import "../global.css";


export default function AuthLayout() {
  // const { isSignedIn } = useAuth();

  // if (isSignedIn) {
  //   return <Redirect href={'/(root)/(tabs)/home'} />
  // }

  

  return (
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}
