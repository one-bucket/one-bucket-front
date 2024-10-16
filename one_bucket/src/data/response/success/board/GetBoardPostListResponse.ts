export interface GetBoardPostListResponse {
    totalPages: number
    totalElements: number
    size: boolean
    content: BoardPostReduced[]
    number: number
    sort: Sort
    first: boolean
    last: boolean
    numberOfElements: number
    pageable: Pageable
    empty: boolean
}

export interface BoardPostReduced {
    boardId: number
    title: string
    text: string
    postId: number
    authorNickname: string
    createdDate: Date
    modifiedDate: Date
    views: number
    likes: number
    commentsCount: number
    imageUrls: string[]
}

interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    paged: boolean
    unpaged: boolean
}

interface Sort {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}
