import { requestLogin } from '@/apis/authService'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { setAccessToken } from '@/utils/accessTokenUtils'
import React, { useEffect, useRef } from 'react'
import {
    Appearance,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import BouncyCheckbox, {
    BouncyCheckboxHandle,
} from 'react-native-bouncy-checkbox'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import IcHide from '@/assets/drawable/bxs_hide.svg'
import IcHide from '@/assets/drawable/clarity_eye-hide-line.svg'
import IcShow from '@/assets/drawable/clarity_eye-show-line.svg'

const Login: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, onLogInSuccess, onLoginFailure } =
        useBoundStore(state => ({
            themeColor: state.themeColor,
            setThemeColor: state.setThemeColor,
            onLogInSuccess: state.onLogInSuccess,
            onLoginFailure: state.onLoginFailure,
        }))

    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = createStyles(themeColor)
    // const styles = createStyles(themeColor)

    const [id, setId] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [autoLoginEnabled, setAutoLoginEnabled] = React.useState(false)
    const navigation = stackNavigation()

    let bouncyCheckboxRef = useRef<BouncyCheckboxHandle>(null)

    const handleLogin = async () => {
        const loginForm = {
            username: id,
            password: password,
        }
        requestLogin(loginForm)
            .then(res => {
                setAccessToken(res.accessToken)
                onLogInSuccess()
            })
            .catch(err => {
                console.log(err)
                onLoginFailure()
            })
    }

    const handleForgotPassword = () => {}

    const handleGoogleLogin = () => {}

    const [easterEgg, setEE] = React.useState(10)
    const [eeVisible, setEEVisible] = React.useState(false)
    const openEE = () => {
        setEEVisible(true)
    }
    const closeEE = () => {
        setEEVisible(false)
    }

    const [hidePw, setHidePw] = React.useState(true)
    const viewPwIcon = (hidePw: boolean) => {
        if(hidePw == true) return (
            <View><IcHide /></View>
        )
        else return (
            <View><IcShow /></View>
        )
    }

    return (
        <View style={[styles.container]}>
            <View
                style={{
                    flex: 4,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 50,
                }}>
                <TouchableOpacity
                    onPress={() => {
                        setEE(easterEgg => easterEgg - 1)
                        if (easterEgg == 1) {
                            setEEVisible(true)
                            setEE(10)
                        }
                    }}
                    activeOpacity={1}>
                    <Image
                        source={require('@/assets/drawable/login_logo.png')}
                        style={styles.logoImage}
                    />
                </TouchableOpacity>
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={eeVisible}
                onRequestClose={closeEE}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('@/assets/drawable/mungmoonge.jpg')}
                    />
                </View>
            </Modal>
            <View
                style={{
                    flex: 5,
                    alignItems: 'center',
                    width: '100%',
                }}>
                <TextInput
                    style={styles.textInput}
                    placeholder='아이디'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    value={id}
                    keyboardType='email-address'
                    onChangeText={setId}
                />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <TextInput
                        style={{...styles.textInput, width: '85%'}}
                        placeholder='비밀번호'
                        placeholderTextColor={themeColor.TEXT_SECONDARY}
                        secureTextEntry={hidePw}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.viewPw}
                        onPress={()=>{setHidePw(!hidePw)}}>
                        {viewPwIcon(hidePw)}
                    </TouchableOpacity>
                </View>
                <View style={styles.autoLoginContainer}>
                    <View style={{ width: '5%' }}>
                        <BouncyCheckbox
                            ref={bouncyCheckboxRef}
                            size={25}
                            fillColor={themeColor.BUTTON_BG}
                            onPress={value => setAutoLoginEnabled(!value)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                bouncyCheckboxRef.current?.onCheckboxPress()
                            }}>
                            <Text style={styles.checkboxLabel}>
                                로그인 상태 유지
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.signUpButtonContainer]}>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={() => navigation.navigate('SignUp5')}>
                        <Text style={styles.signUpButtonText}>계정 생성</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.linkTextContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('NewPw')
                        }}>
                        <Text style={styles.linkText}>
                            비밀번호를 잊으셨나요?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        logoImage: {
            width: 180,
            height: 166,
        },
        textInput: {
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            width: '95%',
            borderBottomWidth: 1,
            padding: 6,
            marginStart: 20,
            marginEnd: 20,
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        viewPw:{
            height: 36,
            width: 36,
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 30,
        },
        autoLoginContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
        },
        checkboxLabel: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
            marginLeft: 16,
        },
        loginButtonContainer: {
            width: '100%',
            marginStart: 20,
            marginEnd: 20,
            marginTop: 20,
            marginBottom: 10,
        },
        loginButton: {
            backgroundColor: theme.BUTTON_BG,
            padding: 18,
            alignItems: 'center',
            borderRadius: 5,
        },
        loginButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        signUpButtonContainer: {
            width: '100%',
            marginStart: 20,
            marginEnd: 20,
            marginBottom: 10,
        },
        signUpButton: {
            backgroundColor: baseColors.SCHOOL_BG_LIGHT,
            padding: 18,
            alignItems: 'center',
            borderRadius: 5,
        },
        signUpButtonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        linkTextContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        linkText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default Login
