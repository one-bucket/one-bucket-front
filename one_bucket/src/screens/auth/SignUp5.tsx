import { postSignupForm, requestLogin } from '@/apis/authService'
import Exclamation from '@/assets/drawable/exclamation.svg'
import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import { baseColors } from '@/constants/colors'
import { signUpErrorMessage } from '@/constants/strings'
import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { SignUpRequestBody } from '@/data/request/signUpRequestBody'
import { AppContext } from '@/hooks/useContext/AppContext'
import { signUpStyles } from '@/styles/signUp/signUpStyles'
import { setAccessToken } from '@/utils/accessTokenMethods'
import { StringFilter } from '@/utils/StringFilter'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useRef, useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
const SignUp5: React.FC = (): React.JSX.Element => {
    const { onSignUpFailure } = useContext(AppContext)
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [nickname, setNickname] = useState('')

    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordConfirmError, setPasswordConfirmError] = useState<
        string | null
    >(null)
    const [nicknameError, setNicknameError] = useState<string | null>(null)

    const scrollViewRef = useRef<ScrollView>(null)
    const passwordRef = useRef<TextInput>(null)
    const passwordConfirmRef = useRef<TextInput>(null)

    const handleEmailChange = (text: string) => {
        if (emailError == signUpErrorMessage.duplicatedEmailOrNickname) {
            setEmailError(null)
        }
        var cleaned = StringFilter.sqlFilter(text)
        setEmail(cleaned)
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text)
        if (text.length < 8 || text.length > 20) {
            setPasswordError(signUpErrorMessage.invalidPasswordLength)
            return
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/
        if (!regex.test(text)) {
            setPasswordError(signUpErrorMessage.invalidPasswordFormat)
            return
        }
        setPasswordError(null)
    }

    const handleScrollViewSwipe = (index: number) => {
        if (password == '' || passwordError) return
        scrollViewRef.current?.scrollTo({
            x: (ScreenWidth - 40) * index,
            y: 0,
            animated: true,
        })
    }

    const handlePasswordConfirmChange = (text: string) => {
        setPasswordConfirm(text)
        if (text !== password) {
            setPasswordConfirmError(signUpErrorMessage.passwordMismatch)
            return
        }
        setPasswordConfirmError(null)
    }

    const handleNickNameChange = (text: string) => {
        if (emailError == signUpErrorMessage.duplicatedEmailOrNickname) {
            setNicknameError(null)
        }
        const cleaned = StringFilter.removeSpecials(text)
        setNickname(cleaned)
        if (cleaned.length < 4 || 14 < cleaned.length) {
            setNicknameError(signUpErrorMessage.invalidNicknameLength)
            return
        }
        setNicknameError(null)
    }

    const handleSubmit = async () => {
        if (!validateEmail(email)) {
            Alert.alert('유효한 메일 주소를 입력해주세요.')
            return
        }

        const form: SignUpRequestBody = {
            username: email,
            password: password,
            nickname: nickname,
        }
        postSignupForm(form)
            .then(res => {
                const loginForm: LoginRequestBody = {
                    username: email,
                    password: password,
                }

                requestLogin(loginForm)
                    .then(res => {
                        setAccessToken(res.accessToken)
                        navigation.navigate('SignUp6', {
                            accessToken: res.accessToken,
                        })
                    })
                    .catch(err => {
                        console.log(`signUp5 - requestLogin: ${err}`)
                    })
            })
            .catch(err => {
                console.log(`signUp5 - submitSignUpForm: ${err}`)
                if (err.response.status === 409) {
                    if (err.response.data.code == 1000) {
                        setEmailError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                        setNicknameError(
                            signUpErrorMessage.duplicatedEmailOrNickname,
                        )
                    }
                }
            })
    }

    const validateEmail = (number: string) => {
        // TODO : 이메일 validation 구현
        return true
    }

    const onPasswordReEnterButtonPress = () => {
        handleScrollViewSwipe(0)
        passwordRef.current?.focus()
        setPassword('')
        setPasswordConfirm('')
    }

    const onPasswordInputBlur = () => {
        handleScrollViewSwipe(1)
        passwordConfirmRef.current?.focus()
    }

    return (
        <KeyboardAvoidingView
            style={signUpStyles.container}
            behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        navigation.goBack()
                    }}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
            </View>
            <View>
                <View style={signUpStyles.headerContainer}>
                    <Text style={signUpStyles.subStep}>1. 본인 인증</Text>
                    <Text style={signUpStyles.subStep}>2. 학교 인증</Text>
                    <Text style={signUpStyles.currentStep}>
                        3. 인증 정보 설정
                    </Text>
                    <Text style={signUpStyles.title}>
                        {`로그인 시 사용할\n인증 정보를 설정해 주세요.`}
                    </Text>
                    <Text style={signUpStyles.subStep}>
                        4. 프로필 정보 입력
                    </Text>
                </View>
                <View>
                    <Text style={styles.label}>로그인 이메일 주소 입력</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleEmailChange}
                        value={email}
                        placeholder='이메일'
                        keyboardType='email-address'
                    />
                    <View
                        style={[
                            { opacity: emailError ? 1 : 0 },
                            styles.errorLabelContainer,
                        ]}>
                        <Exclamation style={styles.exclamation} />
                        <Text style={styles.errorLabel}>{emailError}</Text>
                    </View>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}>
                        <View style={{ width: ScreenWidth - 40 }}>
                            <Text style={styles.label}>비밀번호 입력</Text>
                            <TextInput
                                ref={passwordRef}
                                style={styles.input}
                                onChangeText={handlePasswordChange}
                                onBlur={onPasswordInputBlur}
                                value={password}
                                placeholder='비밀번호'
                                keyboardType='default'
                                secureTextEntry={true}
                                scrollEnabled={false}
                            />
                            <View
                                style={[
                                    { opacity: passwordError ? 1 : 0 },
                                    styles.errorLabelContainer,
                                ]}>
                                <Exclamation style={styles.exclamation} />
                                <Text style={styles.errorLabel}>
                                    {passwordError}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: ScreenWidth - 40 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.label}>비밀번호 확인</Text>
                                <TouchableOpacity
                                    style={styles.pwReEnterButton}
                                    onPress={onPasswordReEnterButtonPress}>
                                    <Text style={styles.pwReEnterButtonText}>
                                        재입력
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                ref={passwordConfirmRef}
                                style={styles.input}
                                onChangeText={handlePasswordConfirmChange}
                                value={passwordConfirm}
                                placeholder='비밀번호를 다시 한 번 입력해 주세요.'
                                keyboardType='default'
                                secureTextEntry={true}
                                scrollEnabled={false}
                            />
                            <View
                                style={[
                                    { opacity: passwordConfirmError ? 1 : 0 },
                                    styles.errorLabelContainer,
                                ]}>
                                <Exclamation style={styles.exclamation} />
                                <Text style={styles.errorLabel}>
                                    {passwordConfirmError}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <Text style={styles.label}>닉네임 입력</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleNickNameChange}
                        value={nickname}
                        placeholder='닉네임'
                        keyboardType='default'
                        scrollEnabled={false}
                    />
                    <View
                        style={[
                            { opacity: nicknameError ? 1 : 0 },
                            styles.errorLabelContainer,
                        ]}>
                        <Exclamation style={styles.exclamation} />
                        <Text style={styles.errorLabel}>{nicknameError}</Text>
                    </View>

                    <TouchableOpacity
                        disabled={
                            !!(
                                emailError ||
                                passwordError ||
                                nicknameError ||
                                passwordConfirmError ||
                                !email ||
                                !password ||
                                !nickname ||
                                !passwordConfirm
                            )
                        }
                        style={[
                            {
                                backgroundColor:
                                    emailError ||
                                    passwordError ||
                                    nicknameError ||
                                    passwordConfirmError ||
                                    !email ||
                                    !password ||
                                    !nickname ||
                                    !passwordConfirm
                                        ? baseColors.GRAY_2
                                        : baseColors.SCHOOL_BG,
                            },
                            styles.button,
                        ]}
                        onPress={handleSubmit}>
                        <Text style={styles.buttonText}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'NanumGothic-Bold',
        marginTop: 20,
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingBottom: 4,
        fontSize: 16,
        marginBottom: 10,
    },
    errorLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exclamation: {
        width: 16,
        height: 16,
        marginBottom: 4,
        marginEnd: 4,
    },
    errorLabel: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'NanumGothic',
        marginBottom: 5,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    pwReEnterButton: {
        borderRadius: 6,
        borderColor: baseColors.GRAY_1,
        borderWidth: 1,
        padding: 8,
        marginTop: 12,
    },
    pwReEnterButtonText: {
        color: baseColors.GRAY_1,
        fontSize: 12,
        fontFamily: 'NanumGothic',
    },
})

export default SignUp5
