import { createBoardPost } from '@/apis/boardService'
import CloseButton from '@/assets/drawable/close-button.svg'
import IcPhotoAdd from '@/assets/drawable/ic-photo-add.svg'
import Loading from '@/components/Loading'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { CreateBoardPostRequestBody } from '@/data/request/board/CreateBoardPostRequestBody'
import { queryBoardList } from '@/hooks/useQuery/boardQuery'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
    Appearance,
    Image,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TextInputContentSizeChangeEventData,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { TextInput } from 'react-native-gesture-handler'
import {
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'

const BoardCreatePost: React.FC = (): JSX.Element => {
    const {
        themeColor,
        setThemeColor,
        pendingBoardRefresh,
        setPendingBoardRefresh,
    } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
        pendingBoardRefresh: state.pendingBoardRefresh,
        setPendingBoardRefresh: state.setPendingBoardRefresh,
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
    type BoardCreatePostRouteProp = RouteProp<
        RootStackParamList,
        'BoardCreatePost'
    >
    const { params } = useRoute<BoardCreatePostRouteProp>()

    const navigation = stackNavigation()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [inputHeight, setInputHeight] = useState(200)

    const [imageUriList, setImageUriList] = useState<string[]>([])

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownValue, setDropdownValue] = useState<number>(-1)

    // const tempBoardList = ['자유게시판', '비밀게시판', '운동 및 헬스']
    const {
        data: boardListData,
        isLoading: boardListIsLoading,
        error: boardListError,
    } = queryBoardList()

    const [dropdownItems, setDropdownItems] = useState<
        { label: string; value: number }[]
    >([])

    useEffect(() => {
        setDropdownItems(
            boardListData!.map(board => {
                return {
                    label: board.name,
                    value: board.id,
                }
            }),
        )
        setDropdownValue(params.boardId)
    }, [])

    const addImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 10 - imageUriList.length,
        }

        launchImageLibrary(options, response => {
            const newImageUriList: string[] = []
            response.assets?.forEach(asset => {
                if (asset.uri) {
                    newImageUriList.push(asset.uri)
                }
            })
            setImageUriList([...imageUriList, ...newImageUriList])
        })
    }

    const deleteImage = (index: number) => {
        const newImageUriList = [...imageUriList]
        newImageUriList.splice(index, 1)
        setImageUriList(newImageUriList)
    }

    const handleInputTextHeightChange = (
        event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => {
        const { height } = event.nativeEvent.contentSize
        if (height > 200) setInputHeight(height)
    }

    const onSubmit = async () => {
        let submitForm: CreateBoardPostRequestBody = {
            boardId: dropdownValue,
            title: title,
            text: content,
        }
        createBoardPost(submitForm)
            .then(res => {
                console.log('board post created')
                // setPendingBoardRefresh(true)
                // useBoundStore.setState({ pendingBoardRefresh: true })
                // params.setPendingRefresh(true)
                setTimeout(() => {
                    navigation.navigate('Board', {
                        pendingRefresh: true,
                    })
                }, 100)
            })
            .catch(err => {
                console.log('board post create failed')
                console.log(err)
            })
    }

    if (boardListIsLoading) return <Loading theme={themeColor} />

    if (boardListError) return <Text>Error...</Text>

    return (
        <View style={styles.container}>
            <View style={{ margin: 10, marginTop: 20 }}>
                <DropDownPicker
                    open={dropdownOpen}
                    value={dropdownValue}
                    items={dropdownItems}
                    setOpen={setDropdownOpen}
                    setValue={setDropdownValue}
                    setItems={setDropdownItems}
                    placeholder='게시판을 선택해 주세요'
                    // placeholderStyle={styles.dropdownPlaceholder}
                    labelStyle={styles.dropdownLabel}
                    style={styles.dropdownContainer}
                    // textStyle={styles.dropdownLabel}
                    dropDownContainerStyle={styles.dropdownContainer}
                    theme={themeColor === lightColors ? 'LIGHT' : 'DARK'}
                />
            </View>
            <View style={styles.bodyContainer}>
                <TextInput
                    style={styles.titleTextInput}
                    placeholder='제목을 입력해주세요.'
                    placeholderTextColor={baseColors.GRAY_2}
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <TextInput
                    style={[
                        styles.contentTextInput,
                        { minHeight: inputHeight },
                    ]}
                    placeholder='내용을 입력해주세요.'
                    placeholderTextColor={baseColors.GRAY_2}
                    value={content}
                    onChangeText={text => setContent(text)}
                    multiline={true}
                    textAlignVertical='top'
                    onContentSizeChange={handleInputTextHeightChange}
                />
                {/* ### 제품 이미지 ### */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={styles.imageScrollViewContainer}>
                    {imageUriList.map((uri, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <TouchableOpacity>
                                <Image
                                    source={{ uri: uri }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => deleteImage(index)}>
                                <CloseButton />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.imageUploader}
                        onPress={addImage}>
                        <View style={styles.imagePlaceholder}>
                            <IcPhotoAdd />
                            <Text
                                style={
                                    styles.imageCountText
                                }>{`${imageUriList.length}/10`}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View style={styles.postButtonContainer}>
                <TouchableNativeFeedback onPress={onSubmit}>
                    <View style={styles.postButton}>
                        <Text style={styles.postButtonText}>게시</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        bodyContainer: {
            marginHorizontal: 20,
        },
        dropdownContainer: {
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_0,
            borderWidth: theme === lightColors ? 1 : 0,
            borderColor: baseColors.GRAY_1,
        },
        dropdownPlaceholder: {
            color: theme.TEXT_SECONDARY,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        dropdownLabel: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        titleTextInput: {
            color: theme.TEXT,
            borderBottomColor: baseColors.GRAY_1,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 16,
            width: '100%',
            borderBottomWidth: 1,
            marginVertical: 0,
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        contentTextInput: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 14,
            width: '100%',
            marginBottom: 10,
            backgroundColor: 'transparent',
        },
        postButtonContainer: {
            position: 'absolute',
            marginTop: 16,
            bottom: 0,
            left: 0,
            right: 0,
        },
        postButton: {
            backgroundColor: baseColors.SCHOOL_BG,
            padding: 20,
            alignItems: 'center',
        },
        postButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
        },
        imageScrollViewContainer: {
            height: 82,
            marginBottom: 16,
        },
        imageContainer: {
            borderColor: baseColors.GRAY_2,
            position: 'relative',
            width: 72,
            height: 72,
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: 14,
            marginTop: 10,
        },
        image: {
            width: 72,
            height: 72,
            borderRadius: 8,
        },
        imageCountText: {
            color: theme.TEXT_TERTIARY,
        },
        closeButton: {
            position: 'absolute',
            top: -10,
            right: -10,
        },
        imageUploader: {
            borderColor: baseColors.GRAY_2,
            width: 72,
            height: 72,
            borderWidth: 1,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        imagePlaceholder: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    })

export default BoardCreatePost
