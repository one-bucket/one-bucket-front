import { createMarketPost } from '@/apis/marketService'
import CloseButton from '@/assets/drawable/close-button.svg'
import IcAngleRight from '@/assets/drawable/ic-angle-right.svg'
import IcPhotoAdd from '@/assets/drawable/ic-photo-add.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { CreateMarketPostRequestBody } from '@/data/request/market/CreateMarketPostBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import CheckBox from '@react-native-community/checkbox'
import React, { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    ImageLibraryOptions,
    launchImageLibrary,
} from 'react-native-image-picker'

const CreateMarketPost: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor, boardList } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
        boardList: state.boardList,
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
    const navigation = stackNavigation()

    const [imageUriList, setImageUriList] = useState<string[]>([])
    const [siteLink, setSiteLink] = useState('')
    const [itemName, setItemName] = useState('')
    const [price, setPrice] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [peopleCount, setPeopleCount] = useState<number | null>(null)
    const [deadline, setDeadline] = useState<number | null>(null)
    const [descriptionTextInput, setDescriptionTextInput] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isLocationNegotiable, setIsLocationNegotiable] = useState(true)

    const [peopleCountManualInputEnabled, setPeopleCountManualInputEnabled] =
        useState(false)
    const peopleCountManualInputRef = useRef<TextInput>(null)
    const [deadlineManualInputEnabled, setDeadlineManualInputEnabled] =
        useState(false)
    const deadlineManualInputRef = useRef<TextInput>(null)
    const scrollViewRef = useRef<ScrollView>(null)

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

    const onPeopleCountManualInputPress = () => {
        setPeopleCount(null)
        setPeopleCountManualInputEnabled(true)
        requestAnimationFrame(() => {
            peopleCountManualInputRef.current?.focus()
        })
    }

    const onDeadlineManualInputPress = () => {
        setDeadline(null)
        setDeadlineManualInputEnabled(true)
        requestAnimationFrame(() => {
            deadlineManualInputRef.current?.focus()
        })
    }

    const findMarketBoardId = () => {
        const marketBoard = boardList.find(board => board.type === 'marketPost')
        if (marketBoard) {
            console.log(marketBoard.id)
            return marketBoard.id
        }
        throw new Error('CreateMarketPost - Market board not found')
    }

    const onSubmit = async () => {
        const form: CreateMarketPostRequestBody = {
            marketPostCreateDto: {
                boardId: findMarketBoardId(),
                title: itemName,
                text: descriptionTextInput,
            },
            tradeCreateDto: {
                item: itemName,
                wanted: Number(totalAmount),
                price: Number(price),
                count: peopleCount ?? 0,
                // TODO: 지도에 마커 찍어서 위치 선택하도록 구현
                location: '서울시 강남구',
                linkUrl: siteLink,
                // TODO: 태그 선택 구현
                tag: '신선식품',
                dueDays: deadline ?? -1,
            },
        }

        console.log(form)

        createMarketPost(form)
            .then(res => {
                navigation.goBack()
            })
            .catch(err => {
                console.log(`createMarketPost error - ${err}`)
            })
    }

    const checkFormAvailable = () => {
        return (
            // TODO: 장소도 추가
            // imageUriList.length > 0 &&
            itemName.length > 0 &&
            price.length > 0 &&
            totalAmount.length > 0 &&
            peopleCount !== null &&
            deadline !== null
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.mainScrollViewContainer}
                showsVerticalScrollIndicator={false}>
                {/* ### 제품 이미지 ### */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={styles.imageScrollViewContainer}>
                    {imageUriList.map((uri, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('ImageEnlargement', {
                                        imageUriList: imageUriList,
                                        index: index,
                                        isLocalUri: true,
                                    })
                                }>
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

                {/* ### 사이트 링크 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>사이트 링크</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder='https://www.market.com/product-name'
                    placeholderTextColor={themeColor.TEXT_TERTIARY}
                    value={siteLink}
                    onChangeText={setSiteLink}
                    keyboardType='url'
                />

                <View style={styles.labelContainer}>
                    <Text style={styles.label}>품목명</Text>
                    <Text style={styles.accent}> *</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder='품목명'
                    placeholderTextColor={themeColor.TEXT_TERTIARY}
                    value={itemName}
                    onChangeText={setItemName}
                />

                {/* ### 가격 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>가격</Text>
                    <Text style={styles.accent}> *</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder='가격'
                    placeholderTextColor={themeColor.TEXT_TERTIARY}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType='numeric'
                />

                {/* ### 총 수량 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>총 수량</Text>
                    <Text style={styles.accent}> *</Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder='총 수량'
                    placeholderTextColor={themeColor.TEXT_TERTIARY}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    keyboardType='numeric'
                />

                {/* ### 모집 인원 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>모집 인원 (본인 포함)</Text>
                    <Text style={styles.accent}> *</Text>
                </View>
                <View style={styles.peopleCountContainer}>
                    {[2, 3, 4, 5].map(count => (
                        <View
                            key={count}
                            style={{
                                flex: 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                                style={[
                                    styles.selectionButton,
                                    peopleCount === count &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => {
                                    setPeopleCount(count)
                                    setPeopleCountManualInputEnabled(false)
                                }}>
                                <Text
                                    style={{
                                        color:
                                            peopleCount === count
                                                ? 'white'
                                                : 'gray',
                                    }}>
                                    {`${count}명`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.manualInputButton,
                            peopleCountManualInputEnabled
                                ? styles.selectedButton
                                : {},
                        ]}
                        onPress={onPeopleCountManualInputPress}>
                        <TextInput
                            ref={peopleCountManualInputRef}
                            style={[
                                styles.manualInputText,
                                peopleCountManualInputEnabled
                                    ? { color: baseColors.WHITE }
                                    : { color: baseColors.GRAY_2 },
                            ]}
                            onChangeText={text => setPeopleCount(Number(text))}
                            placeholder='직접 입력'
                            placeholderTextColor={
                                peopleCountManualInputEnabled ? 'white' : 'gray'
                            }
                            maxLength={2}
                            editable={peopleCountManualInputEnabled}
                            keyboardType='numeric'
                        />
                        <Text
                            style={[
                                styles.manualInputAffixText,
                                { marginBottom: 2 },
                            ]}>
                            {peopleCountManualInputEnabled && peopleCount
                                ? ' 명'
                                : ''}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ### 마감 기한 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>마감 기한</Text>
                    <Text style={styles.accent}> *</Text>
                </View>

                <View style={styles.peopleCountContainer}>
                    {[3, 5, 7, 9].map(count => (
                        <View
                            key={count}
                            style={{
                                flex: 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                                style={[
                                    styles.selectionButton,
                                    deadline === count && styles.selectedButton,
                                ]}
                                onPress={() => {
                                    setDeadline(count)
                                    setDeadlineManualInputEnabled(false)
                                }}>
                                <Text
                                    style={{
                                        color:
                                            deadline === count
                                                ? 'white'
                                                : 'gray',
                                    }}>
                                    {`D-${count}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.manualInputButton,
                            deadlineManualInputEnabled
                                ? styles.selectedButton
                                : {},
                        ]}
                        onPress={onDeadlineManualInputPress}>
                        <Text style={styles.manualInputAffixText}>
                            {deadlineManualInputEnabled && deadline ? 'D-' : ''}
                        </Text>

                        <TextInput
                            ref={deadlineManualInputRef}
                            style={[
                                styles.manualInputText,
                                deadlineManualInputEnabled
                                    ? { color: baseColors.WHITE }
                                    : { color: baseColors.GRAY_2 },
                            ]}
                            maxLength={2}
                            onChangeText={text => setDeadline(Number(text))}
                            placeholder='직접 입력'
                            placeholderTextColor={
                                deadlineManualInputEnabled ? 'white' : 'gray'
                            }
                            editable={deadlineManualInputEnabled}
                            keyboardType='numeric'
                        />
                    </TouchableOpacity>
                </View>

                {/* ### 장소 선택 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>거래 희망 장소</Text>
                    <Text style={styles.accent}> *</Text>
                </View>
                <TouchableOpacity style={styles.locationSelectionButton}>
                    <Text style={styles.locationText}>장소 선택</Text>
                    <IcAngleRight width={16} height={16} fill='gray' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.checkBoxContainer}
                    onPress={() =>
                        setIsLocationNegotiable(!isLocationNegotiable)
                    }>
                    <CheckBox
                        disabled={false}
                        value={isLocationNegotiable}
                        onValueChange={newVal =>
                            setIsLocationNegotiable(newVal)
                        }
                        tintColors={
                            themeColor === lightColors
                                ? {
                                      true: baseColors.SCHOOL_BG,
                                      false: baseColors.GRAY_2,
                                  }
                                : {
                                      true: baseColors.WHITE,
                                      false: baseColors.GRAY_1,
                                  }
                        }
                    />
                    <Text
                        style={[
                            styles.checkBoxLabelText,
                            {
                                color: !isLocationNegotiable
                                    ? themeColor.TEXT_TERTIARY
                                    : themeColor === lightColors
                                    ? baseColors.SCHOOL_BG
                                    : baseColors.WHITE,
                            },
                        ]}>
                        거래 장소 협의 가능
                    </Text>
                </TouchableOpacity>

                {/* ### 추가 설명 ### */}
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>설명</Text>
                </View>
                <TextInput
                    style={[styles.textInput, styles.descriptionTextInput]}
                    placeholder='추가 설명을 작성해 주세요.'
                    placeholderTextColor={themeColor.TEXT_TERTIARY}
                    value={descriptionTextInput}
                    onChangeText={setDescriptionTextInput}
                    multiline
                />
                <View style={{ height: 80 }}></View>
            </ScrollView>
            <View
                style={[
                    styles.postButtonContainer,
                    { bottom: keyboardHeight },
                ]}>
                <TouchableOpacity
                    style={[
                        styles.postButton,
                        {
                            backgroundColor: checkFormAvailable()
                                ? themeColor.BUTTON_BG
                                : themeColor.BUTTON_SECONDARY_BG_DARKER,
                        },
                    ]}
                    onPress={onSubmit}
                    disabled={!checkFormAvailable()}>
                    <Text style={styles.postButtonText}>게시</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
        },
        mainScrollViewContainer: {
            margin: 16,
            marginBottom: 54,
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
        labelContainer: {
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 6,
        },
        label: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
        },
        accent: {
            fontFamily: 'NanumGothic-Bold',
            color: theme.ACCENT_TEXT,
        },
        textInput: {
            color: theme.TEXT,
            borderColor: baseColors.GRAY_2,
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
        },
        peopleCountContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 16,
        },
        selectionButton: {
            borderColor: baseColors.GRAY_2,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 8,
        },
        manualInputButton: {
            borderColor: baseColors.GRAY_2,
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderWidth: 1,
            borderRadius: 8,
        },
        manualInputText: {
            flex: 2,
            padding: 0,
            margin: 0,
            fontSize: 14,
        },
        manualInputAffixText: {
            color: 'white',
            fontFamily: 'NanumGothic',
            fontSize: 14,
        },
        selectedButton: {
            backgroundColor: baseColors.SCHOOL_BG,
            borderColor: baseColors.SCHOOL_BG,
        },
        descriptionTextInput: {
            height: 100,
            textAlignVertical: 'top',
        },
        locationSelectionButton: {
            borderColor: baseColors.GRAY_2,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
        },
        locationText: {},
        checkBoxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        checkBoxLabelText: {
            marginBottom: 4,
        },
        postButtonContainer: {
            position: 'absolute',
            marginTop: 16,
            bottom: 0,
            left: 0,
            right: 0,
        },
        postButton: {
            padding: 20,
            alignItems: 'center',
        },
        postButtonText: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 14,
        },
    })

export default CreateMarketPost
