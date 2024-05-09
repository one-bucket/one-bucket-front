import React from 'react'
import {
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { requestLogin } from '@/apis/auth/loginAxiosRequests'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { storeAccessToken } from '@/utils/accessTokenMethods'

const Login = () => {
    const [id, setId] = React.useState('')
    const [password, setPassword] = React.useState('')
    const navigation = stackNavigation()

    const handleLogin = async () => {
        const loginForm = {
            username: id,
            password: password,
        }
        const result = await requestLogin(loginForm)
        if (result) {
        } else {
        }
    }

    const handleForgotPassword = () => {}

    const handleGoogleLogin = () => {}

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='ID'
                value={id}
                onChangeText={setId}
            />
            <TextInput
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title='로그인' onPress={handleLogin} />
            <Button
                title='회원가입'
                onPress={() => navigation.navigate('Signup')}
            />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.input}>ID/PW 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoogleLogin}>
                    <Text style={styles.input}>구글 로그인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    linkText: {
        marginTop: 10,
        color: 'blue',
        textDecorationLine: 'underline',
    },
})

export default Login