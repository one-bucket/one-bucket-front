import { Icolor, lightColors } from '@/constants/colors'
import { GetBoardListResponse } from '@/data/response/success/board/GetBoardListResponse'
import { removeAccessToken } from '@/utils/accessTokenUtils'
import Toast from 'react-native-toast-message'
import { StateCreator } from 'zustand'

export interface BoardSlice {
    boardList: GetBoardListResponse
    setBoardList: (boardList: GetBoardListResponse) => void
    boardRefreshParam: number
    BoardRefreshParamincrement: () => void
    showTitleMissingToast: () => void
}

export const createBoardSlice: StateCreator<BoardSlice, [], []> = (
    set,
    get,
) => ({
    boardList: [],
    setBoardList: (boardList: GetBoardListResponse) => {
        set({ boardList })
    },
    boardRefreshParam: 0,
    BoardRefreshParamincrement: () => {
        set({ boardRefreshParam: get().boardRefreshParam + 1 })
    },
    showTitleMissingToast: () => {
        Toast.show({
            type: 'error',
            text1: '서버와의 통신에 오류가 발생했습니다.',
            text2: '잠시 후 다시 시도해 주세요.',
            visibilityTime: 2500,
        })
    },
})
