/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native'

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import Home from 'screens/Home'
import { mainRoutes } from 'screens/navigation/mainRoutes'
import { darkColors, lightColors } from 'constants/colors'
import Login from 'screens/Login'
import Signup from 'screens/Signup'
import SetProfile from '@/screens/SetProfile'
import { checkAccessTokenAvailable } from '@/utils/accessTokenMethods'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MainScreen = () => {
    return (
        <Tab.Navigator initialRouteName='Home'>
            {mainRoutes.map(route => (
                <Tab.Screen
                    key={`screen-${route.name}`}
                    name={route.name}
                    component={route.component}
                    options={{
                        // headerStyle: {
                        //   backgroundColor: colors.ICON_BG
                        // },
                        // headerTintColor: colors.ICON_TEXT,
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Image
                                    testID={`tabIcon-${route.name}`}
                                    source={
                                        focused
                                            ? route.activeIcon
                                            : route.inactiveIcon
                                    }
                                    style={{ width: 20, height: 20 }}
                                />
                            )
                        },
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}

function App(): React.JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const isDarkMode = useColorScheme() === 'dark'
    const colors = isDarkMode ? darkColors : lightColors
    useEffect(() => {
        const checkLoginStatus = async () => {
            const isLoggedIn = await checkAccessTokenAvailable()
            setIsLoggedIn(isLoggedIn)
        }

        checkLoginStatus()
    }, [])

    return isLoggedIn ? (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Main'
                    component={MainScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    ) : (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={Signup} />
                <Stack.Screen name='SetProfile' component={SetProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
})

export default App
