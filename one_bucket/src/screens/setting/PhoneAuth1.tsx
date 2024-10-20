import IcArrowLeft from '@/assets/drawable/ic-arrow-left.svg'
import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSignUpStyles } from '@/styles/signUp/signUpStyles'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Appearance,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import { PhoneRequestBody } from '@/data/request/SignUpRequestBody'
// import { postPhoneForm, requestPhone } from '@/apis/authService'
import { setAccessToken } from '@/utils/accessTokenUtils'

const PhoneAuth1: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
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

    const navigation = stackNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')
    const styles = createStyles(themeColor)
    const signUpStyles = createSignUpStyles(themeColor)

    const handlePhoneNumberChange = (text: string) => {
        const cleaned = text.replaceAll(/[^0-9]/g, '') // Remove non-numeric characters
        let formatted = cleaned

        if (cleaned.length > 3 && cleaned.length <= 6) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
        } else if (cleaned.length > 6 && cleaned.length < 11) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                6,
            )}-${cleaned.slice(6, 11)}`
        } else if (cleaned.length >= 11) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                7,
            )}-${cleaned.slice(7, 11)}`
        }

        setPhoneNumber(formatted)
    }

    const handlePhoneNumberSubmit = () => {
        if (validatePhoneNumber(phoneNumber) === true) {
            navigation.navigate('PhoneAuth2', {
                phoneNumber: phoneNumber,
            })
        } else {
            Alert.alert('휴대폰 번호를 정확히 입력해주세요.')
        }
    }
{/*
    const handleSubmit = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            Alert.alert('휴대폰 번호를 정확히 입력해주세요.')
            return
        }

        const form: PhoneRequestBody = {
            phonenumber: phoneNumber,
        }
        postPhoneForm(form)
            .then(res => {
                const loginForm: PhoneRequestBody = {
                    phonenumber: phoneNumber,
                }

                requestPhone(loginForm)
                    .then(res => {
                        setAccessToken(res.accessToken)
                        navigation.navigate('SignUp6')
                    })
                    .catch(err => {
                        console.log(`signUp - requestLogin: ${err}`)
                    })
            })
            .catch(err => 
            {/*
                {
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
            }   /*}
                )
    }
*/}
    const validatePhoneNumber = (number: string) => {
        // TODO : 최초 세자리 (010, 011, ...) validation 구현
        if (number.replaceAll('-', '').length >= 10) {
            return true
        } else {
            return false
        }
    }

    return (
        <View style={signUpStyles.container}>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={signUpStyles.backButton}>
                    <IcArrowLeft />
                </TouchableOpacity>
                <Text style={styles.phoneLabel}>휴대폰 번호 입력</Text>
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    onChangeText={handlePhoneNumberChange}
                    value={phoneNumber}
                    placeholder="'-' 없이 입력"
                    keyboardType='number-pad'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handlePhoneNumberSubmit}>
                    <Text style={styles.buttonText}>인증번호 발송</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        phoneLabel: {
            color: theme.TEXT,
            fontSize: 18,
            alignSelf: 'center',
            fontFamily: 'NanumGothic-Bold',
            marginTop: 30,
            marginBottom: 10,
        },
        inputText: {
            color: theme.TEXT,
            borderBottomWidth: 1,
            borderBottomColor: theme.BORDER,
            paddingBottom: 8,
            fontSize: 16,
            fontFamily: 'NanumGothic',
            textAlign: 'center',
            marginBottom: 30,
        },
        button: {
            backgroundColor: theme.BUTTON_BG,
            paddingVertical: 15,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default PhoneAuth1