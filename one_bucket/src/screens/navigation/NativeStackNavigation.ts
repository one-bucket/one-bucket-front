import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'

export type RootStackParamList = {
    /*
    SignUp: undefined
    SignUp2: {
        phoneNumber: string
    }
    SignUp3: undefined
    SignUp4: {
        schoolName: string
        schoolEmail: string
    } */
    SignUp5: undefined
    SignUp6: undefined
    SignUp7: undefined

    Board: {
        pendingRefresh: boolean
    }
    BoardPost: {
        boardId: number
        postId: number
    }
    BoardCreatePost: {
        boardName: string
        boardId: number
    }

    Search: undefined

    Notification: undefined

    Setting: undefined

    SchoolAuth1: undefined
    SchoolAuth2: {
        schoolName: string
        schoolEmail: string
    }
    SchoolAuth3: undefined
    PhoneAuth1: undefined
    PhoneAuth2: {
        phoneNumber: string
    }
    PhoneAuth3: undefined

    AlertSetting: undefined
    Announcement: undefined
    Support: undefined
    VersionCheck: undefined

    ChatList: undefined
    Chat: {
        roomId: string
    }

    ProfileDetails: undefined
    GroupPurchasePost: undefined
    PostGroupPurchase: undefined

    ImageEnlargement: {
        imageUriList: string[]
        index: number
    }
}

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const stackNavigation = useNavigation<RootStackNavigationProp>
