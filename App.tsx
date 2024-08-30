import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold} from '@expo-google-fonts/roboto';
import { Loading } from '@components/Loading';
import { THEME } from 'src/theme';

import { Routes } from '@routes/index';
import { AuthContextProvider } from 'src/context/AuthContext';

import { OneSignal } from "react-native-onesignal"

OneSignal.initialize("33807c43-e0c2-4632-b33e-b31e43cbfb92");
OneSignal.Notifications.requestPermission(true);

export default function App() {
  const [ fontsLoaded ] = useFonts({Roboto_400Regular, Roboto_700Bold});
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle={'light-content'}
        translucent
        backgroundColor="transparent"
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes/> : <Loading/>}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
