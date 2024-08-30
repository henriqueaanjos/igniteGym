import { Platform } from "react-native";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Exercise } from "src/screens/Exercise";
import { History } from "src/screens/History";
import { Home } from "src/screens/Home";
import { Profile } from "src/screens/Profile";

import { Notification } from "@components/Notification";

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';
import { useTheme } from "native-base";
import { useEffect, useState } from "react";
import { NotificationWillDisplayEvent, OneSignal, OSNotification } from "react-native-onesignal";

type AppRoutes = {
    home: undefined,
    exercise: {
        exerciseId: string
    },
    profile: undefined
    history: undefined,
}

export type AppNavigatorRouteProps = BottomTabNavigationProp<AppRoutes>;

const {Navigator, Screen} = createBottomTabNavigator<AppRoutes>();

export function AppRoutes(){
    const { sizes, colors } = useTheme();
    const [notification, setNotification] = useState<OSNotification>();

    const iconSize = sizes[8];
    useEffect(() => {
        const handleNotfication = (event: NotificationWillDisplayEvent) => {
          event.preventDefault();
          const response = event.getNotification();
          setNotification(response);
          console.log("Chegou !");
        }
    
        OneSignal.Notifications.addEventListener("foregroundWillDisplay", handleNotfication);
    
        return () => OneSignal.Notifications.removeEventListener("foregroundWillDisplay", handleNotfication);
      },[]);
    return(
        <>
        
            <Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: colors.green[500],
                    tabBarInactiveTintColor: colors.gray[200],
                    tabBarStyle:{
                        backgroundColor: colors.gray[600],
                        borderTopWidth: 0,
                        height: Platform.OS === 'android' ? 'auto' : 96,
                        paddingBottom: sizes[10],
                        paddingTop: sizes[6]
                    }
                }}
            >
                <Screen
                    name="home"
                    component={Home}
                    options={{
                        tabBarIcon: ({color}) => (
                            <HomeSvg 
                                fill={color}
                                width={iconSize}
                                height={iconSize}
                            />
                        )
                    }}
                />
                <Screen
                    name="history"
                    component={History}
                    options={{
                        tabBarIcon: ({color}) => (
                            <HistorySvg 
                                fill={color}
                                width={iconSize}
                                height={iconSize}
                            />
                        )
                    }}
                />
                <Screen
                    name="profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({color}) => (
                            <ProfileSvg 
                                fill={color}
                                width={iconSize}
                                height={iconSize}
                            />
                        )
                    }}
                />
                <Screen
                    name="exercise"
                    component={Exercise}
                    options={{
                        tabBarButton: () => null
                    }}
                />
            </Navigator>
            {notification?.title && 
                    <Notification data={notification} onClose={() => setNotification(undefined)}/>
                }
        </>
    );
}