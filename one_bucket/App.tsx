/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

import { getMemberInfo } from '@/apis/profileService'
import strings from '@/constants/strings'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import ProfileModify from '@/screens/PofileModify'
import PostGroupPurchase from '@/screens/PostGroupPurchase'
import ProfileDetails from '@/screens/ProfileDetails'
import Setting from '@/screens/Setting'
import Login from '@/screens/auth/Login'
import SignUp from '@/screens/auth/SignUp'
import SignUp2 from '@/screens/auth/SignUp2'
import SignUp3 from '@/screens/auth/SignUp3'
import SignUp4 from '@/screens/auth/SignUp4'
import SignUp5 from '@/screens/auth/SignUp5'
import SignUp6 from '@/screens/auth/SignUp6'
import SignUp7 from '@/screens/auth/SignUp7'
import BoardPost from '@/screens/home/BoardPost'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { removeAccessToken } from '@/utils/accessTokenUtils'
import IcAngleLeft from 'assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from 'constants/colors'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mainRoutes } from 'screens/navigation/mainRoutes'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
    // key를 통해 테마 변경 시 리렌더링
    const loginState = useBoundStore(state => state.loginState)
    const setLoginState = useBoundStore(state => state.setLoginState)
    const isDarkMode = useColorScheme() === 'dark'

    const [themeColor, setThemeColor] = useState<Icolor>(
        isDarkMode ? darkColors : lightColors,
    )
    const queryClient = new QueryClient()

    const MainScreen: React.FC = () => {
        return (
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: themeColor.BG,
                    },
                    headerStyle: {
                        backgroundColor: themeColor.HEADER_BG,
                    },
                }}>
                {mainRoutes.map(route => (
                    <Tab.Screen
                        key={`screen-${route.name}`}
                        name={route.name}
                        component={route.component}
                        options={{
                            headerRight: route.headerRight,
                            headerTintColor: themeColor.HEADER_TEXT,
                            tabBarIcon: ({ focused }) => {
                                if (themeColor === lightColors) {
                                    return focused
                                        ? route.activeIconLight
                                        : route.inactiveIconLight
                                } else {
                                    return focused
                                        ? route.activeIconDark
                                        : route.inactiveIconDark
                                }
                            },
                        }}
                    />
                ))}
            </Tab.Navigator>
        )
    }

    const onLogOut = async (showToast: boolean = true) => {
        await removeAccessToken()
        setLoginState(false)
        if (showToast) {
            Toast.show({
                type: 'success',
                text1: '성공적으로 로그아웃하였습니다.',
            })
        }
    }

    const onLogInSuccess = async () => {
        setLoginState(true)
        Toast.show({
            type: 'success',
            text1: '성공적으로 로그인하였습니다.',
        })
    }

    const onLoginFailure = async () => {
        setLoginState(false)
        Toast.show({
            type: 'error',
            text1: '로그인에 실패하였습니다.',
        })
    }

    const onPhoneVerificationFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '인증번호가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    }

    const onSchoolEmailVerificationFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '인증 코드가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    }

    const onSignUpSuccess = async () => {
        Toast.show({
            type: 'success',
            text1: '계정 생성이 완료되었습니다!',
            text2: '이제 세부 프로필 정보 기입을 진행해 주세요.',
            visibilityTime: 2500,
        })
    }

    const onSignUpFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '서버와의 통신에 오류가 발생했습니다.',
            text2: '잠시 후 다시 시도해 주세요.',
            visibilityTime: 2500,
        })
    }

    useEffect(() => {
        const ac = new AbortController()
        console.log(useBoundStore.getState().loginState)
        const checkLoginStatus = async () => {
            await getMemberInfo()
                .then(response => {
                    if (response) {
                        // memberInfo를 profileStore에 저장

                        setLoginState(true)
                    }
                })
                .catch(error => {
                    setLoginState(false)
                    if (
                        error.response.status === 401 ||
                        error.response.status === 403
                    ) {
                        console.log(`App - checkLoginStatus error: ${error}`)

                        // TODO: refreshToken으로 accessToken 갱신
                    }
                })
            SplashScreen.hide()
        }

        checkLoginStatus()

        return function cleanup() {
            ac.abort()
        }
    }, [])

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider
                    value={{
                        onLogOut,
                        onLogInSuccess,
                        onLoginFailure,
                        onPhoneVerificationFailure,
                        onSchoolEmailVerificationFailure,
                        onSignUpSuccess,
                        onSignUpFailure,
                        themeColor,
                        setThemeColor,
                    }}>
                    {loginState ? (
                        <NavigationContainer
                            theme={
                                themeColor === lightColors
                                    ? lightNavTheme
                                    : darkNavTheme
                            }>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name='Main'
                                    component={MainScreen}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    options={{
                                        headerStyle: {
                                            backgroundColor:
                                                themeColor === lightColors
                                                    ? themeColor.HEADER_BG
                                                    : themeColor.HEADER_BG,
                                        },
                                        headerTintColor: themeColor.HEADER_TEXT,
                                        headerRight: () => (
                                            <View>
                                                <TouchableOpacity>
                                                    <Text
                                                        style={{
                                                            color: themeColor.HEADER_TEXT,
                                                            fontFamily:
                                                                'NanumGothic',
                                                            marginEnd: 16,
                                                        }}>
                                                        임시저장
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ),
                                    }}
                                    name={strings.postGroupPurchaseScreenName}
                                    component={PostGroupPurchase}
                                />
                                <Stack.Screen
                                    name={strings.profileDetailsScreenName}
                                    component={ProfileDetails}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name={strings.profileModifyScreenName}
                                    component={ProfileModify}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name={strings.settingScreenName}
                                    component={Setting}
                                    options={{
                                        headerLeft: () => {
                                            const navigation = stackNavigation()
                                            return (
                                                <TouchableOpacity
                                                    style={{ marginLeft: 16 }}
                                                    onPress={() =>
                                                        navigation.goBack()
                                                    }>
                                                    <IcAngleLeft
                                                        fill={
                                                            themeColor.HEADER_TEXT
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            )
                                        },
                                        headerStyle: {
                                            backgroundColor:
                                                themeColor.HEADER_BG,
                                        },
                                        headerTitleStyle: {
                                            color: themeColor.HEADER_TEXT,
                                            fontFamily: 'NanumGothic',
                                            fontSize: 18,
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name={strings.boardPostScreenName}
                                    component={BoardPost}
                                    options={{
                                        headerLeft: () => {
                                            const navigation = stackNavigation()
                                            return (
                                                <TouchableOpacity
                                                    style={{ marginLeft: 16 }}
                                                    onPress={() =>
                                                        navigation.goBack()
                                                    }>
                                                    <IcAngleLeft
                                                        fill={
                                                            themeColor.HEADER_TEXT
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            )
                                        },
                                        headerStyle: {
                                            backgroundColor:
                                                themeColor.HEADER_BG,
                                        },
                                        headerTitleStyle: {
                                            color: themeColor.HEADER_TEXT,
                                            fontFamily: 'NanumGothic',
                                            fontSize: 18,
                                        },
                                    }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    ) : (
                        <NavigationContainer
                            theme={
                                themeColor === lightColors
                                    ? lightNavTheme
                                    : darkNavTheme
                            }>
                            <Stack.Navigator
                                screenOptions={{ headerShown: false }}
                                initialRouteName={strings.loginScreenName}>
                                <Stack.Screen
                                    name={strings.loginScreenName}
                                    component={Login}
                                />
                                <Stack.Screen
                                    name={strings.signUp1ScreenName}
                                    component={SignUp}
                                />
                                <Stack.Screen
                                    name={strings.signUp2ScreenName}
                                    component={SignUp2}
                                />
                                <Stack.Screen
                                    name={strings.signUp3ScreenName}
                                    component={SignUp3}
                                />
                                <Stack.Screen
                                    name={strings.signUp4ScreenName}
                                    component={SignUp4}
                                />
                                <Stack.Screen
                                    name={strings.signUp5ScreenName}
                                    component={SignUp5}
                                />
                                <Stack.Screen
                                    name={strings.signUp6ScreenName}
                                    component={SignUp6}
                                />
                                <Stack.Screen
                                    name={strings.signUp7ScreenName}
                                    component={SignUp7}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    )}
                </AppContext.Provider>
                <Toast
                    position='bottom'
                    bottomOffset={40}
                    visibilityTime={1000}
                />
            </QueryClientProvider>
        </>
    )
}

const lightNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: baseColors.WHITE,
    },
}

const darkNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: baseColors.DARK_BG,
    },
}
export default App
