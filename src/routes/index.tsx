import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { NotificationWillDisplayEvent, OSNotification, OneSignal } from 'react-native-onesignal';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

const linking = {
    prefixes: ["com.henriqueanjos.igniteGym://", "igniteGym://", "exp+igniteGym://"],
    config:{
      screens:{
        exercise: {
          path: '/exercise/:exerciseId',
          parse: {
            exerciseId: (exerciseId: string) => exerciseId,
          }
        },
        home: {
            path: '/home',
        },
        NotFound: '*',
      }
    }
  }

export function Routes(){
    const { colors } = useTheme();
    const { user, isLoadingUserStorageData } = useAuth();

    const theme  = DefaultTheme;
    theme.colors.background = colors.gray[700]

    if(isLoadingUserStorageData){
        return <Loading/>
    }

    return(
        <Box flex={1} bg="gray.700">
            <NavigationContainer theme={theme} linking={linking}>
                {user.id ? <AppRoutes/> : <AuthRoutes/>}
            </NavigationContainer>
        </Box>
    )
}