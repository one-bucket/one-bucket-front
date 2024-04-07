export const schoolColors = {
    HONGIK_NAVY : '#002c62',
    HONGIK_TEXT: '#FFFFFF'
}

export const baseColors = {
    WHITE : '#FFFFFF',
    BLACK: '#000000',
    SCHOOL_BG : schoolColors.HONGIK_NAVY,
    SCHOOL_TEXT: schoolColors.HONGIK_TEXT,
    GRAY_1 : '#F0F0F0',
    GRAY_2 : '#D9D9D9',
    GRAY_3 : '#818181',
    RED : '#FF0000',
}

type Icolor = {
    BG : String,
    ICON_BG : String,
    ICON_TEXT : String,
    TEXT_PRIMARY : String,
    TEXT_SECONDARY : String,
    TAB_TEXT : String,
    TAG_TEXT : String,
    TAG_BG : String,
    BORDER : String,
    GROUPED_CONTENTS_BG : String,
}

export const lightColors : Icolor = {
    BG : baseColors.WHITE,
    ICON_BG : baseColors.SCHOOL_BG,
    ICON_TEXT : baseColors.SCHOOL_TEXT,
    TEXT_PRIMARY : baseColors.BLACK,
    TEXT_SECONDARY : baseColors.GRAY_3,
    TAB_TEXT : baseColors.GRAY_3,
    TAG_TEXT : baseColors.WHITE,
    TAG_BG : baseColors.GRAY_2,
    BORDER : baseColors.GRAY_2,
    GROUPED_CONTENTS_BG : baseColors.GRAY_1,
}

export const darkColors : Icolor = {
    BG : baseColors.WHITE,
    ICON_BG : baseColors.SCHOOL_BG,
    ICON_TEXT : baseColors.SCHOOL_TEXT,
    TEXT_PRIMARY : baseColors.BLACK,
    TEXT_SECONDARY : baseColors.GRAY_3,
    TAB_TEXT : baseColors.GRAY_3,
    TAG_TEXT : baseColors.WHITE,
    TAG_BG : baseColors.GRAY_2,
    BORDER : baseColors.GRAY_2,
    GROUPED_CONTENTS_BG : baseColors.GRAY_1,
}
