/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import Home from "screens/Home";
import Search from "screens/Search";
import Chat from "screens/Chat";
import Mypage from "screens/Mypage";


export const mainRoutes = [
    {
        name: '홈',
        title: '홈',
        component: Home,
        inactiveIcon: require('assets/icons/tab/icon_home_inactive.png'),
        activeIcon: require('assets/icons/tab/icon_home_active.png')
    },
    {
        name: '채팅',
        component: Chat,
        inactiveIcon: require('assets/icons/tab/icon_chat_inactive.png'),
        activeIcon: require('assets/icons/tab/icon_chat_active.png')
    },
    {
        name: 'MY',
        component: Mypage,
        inactiveIcon: require('assets/icons/tab/icon_mypage_inactive.png'),
        activeIcon: require('assets/icons/tab/icon_mypage_active.png')
    }
]