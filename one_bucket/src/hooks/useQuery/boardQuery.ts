import { getBoardPost, getBoardPostList } from '@/apis/boardService'
import { GetBoardPostListResponse } from '@/data/response/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/GetBoardPostResponse'
import { useQuery } from 'react-query'

export const queryBoardPost = (postId: number) => {
    return useQuery<GetBoardPostResponse>(['boardPost', postId], () =>
        getBoardPost(postId),
    )
}

type SortType = {
    sortType: 'title' | 'createdDate'
    sort: 'asc' | 'desc'
}

export const queryBoardPostList = (
    boardId: number,
    page: number,
    sortType: SortType,
    size = 10,
) => {
    return useQuery<GetBoardPostListResponse>(
        ['boardPostList', boardId, page, size, sortType],
        () => {
            if (sortType.sortType === 'title') {
                return getBoardPostList(boardId, page, size, [
                    `title,${sortType.sort}`,
                    `createdDate,${sortType.sort}`,
                ])
            }
            return getBoardPostList(boardId, page, size, [
                `createdDate,${sortType.sort}`,
                `title,${sortType.sort}`,
            ])
        },
    )
}