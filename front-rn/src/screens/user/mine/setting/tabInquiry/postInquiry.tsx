import { useEffect, useState } from "react"
import {
    Image,
    Modal,
    Pressable,
    TextInput,
    View,
    SafeAreaView,
    Platform,
    StatusBar,
    ActivityIndicator,
    PermissionsAndroid,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { ErrorUtil, RatioUtil } from "utils"
import { Colors } from "const"
import { InquiryImg, RaffleImg, myPageImg, nftDetailImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { jsonSvc } from "apis/services"

import { mineStyle, rankStyle } from "styles"
import { TouchableOpacity } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { walletStyle } from "styles/wallet.style"
import { NFTCardImages } from "assets/images"
import ImagePicker from "react-native-image-crop-picker"
import inquiryCategoryJson from "json/personal_inquiry.json"
import { inquirySvc } from "apis/services/inquiry.svc"
import DeviceInfo from "react-native-device-info"
import WebView from "react-native-webview"
import { CLOSE_WEBVIEW_MESSAGE } from "apis/data"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { createThumbnail } from "react-native-create-thumbnail"
import { type } from "os"

const PostInquiry = ({ onSelect }: { onSelect: (data: React.SetStateAction<number>) => void }) => {
    const [deviceName, setDeviceName] = useState<string>("-")
    const [versionOS, setVersionOS] = useState<string>("-")
    const [AppVersion, setAppVersion] = useState<string>("-")
    const [categorySelect, setCategory] = useState<{ id: number; label: string; form: number }>()
    const [idInquiry, setIdInquiry] = useState(1)
    const [titleInput, setTitle] = useState<string>("")
    const [contentInput, setContent] = useState<string>("")
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [optionPickImage, setOptionPickImage] = useState<boolean>(false)
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
    const [isPolicy, setIsPolicy] = useState<boolean>(false)
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [isFocusContent, setIsFocusContent] = useState<boolean>(false)
    const [checkButton, setCheck] = useState<boolean>(false)
    const [listCategory, setListCategory] = useState<any[]>([])
    const [termVisible, setTermVisible] = useState<boolean>(false)
    const inset = useSafeAreaInsets()
    const [loading, setLoading] = useState<boolean>(false)
    const [showError, setShowError] = useState<boolean>(false)
    const getListCategory = () => {
        let list: any = []
        inquiryCategoryJson.map((item: any) => {
            if (jsonSvc.findLocalById(item.nInquiryCategoryTitle.toString())) {
                list.push({
                    id: item.nID,
                    label: jsonSvc.findLocalById(item.nInquiryCategoryTitle.toString()),
                    form: item.nForm,
                })
            }
        })
        setListCategory(list)
        setCategory(list[0])
    }
    useEffect(() => {
        getListCategory()
        getDeviceInfo()
    }, [])
    const getDeviceInfo = async () => {
        const model = Platform.OS === "android" ? await DeviceInfo.getDeviceName() : DeviceInfo.getModel()
        setDeviceName(model)
        const systemVersion = DeviceInfo.getSystemVersion()
        setVersionOS(systemVersion)
        const versionAPP = DeviceInfo.getVersion()
        setAppVersion(versionAPP)
    }
    const submitInquiry = async (formData: any) => {
        setLoading(true)
        const response = await inquirySvc.submitInquiry({
            formData: formData,
        })
        setLoading(false)
        if (!response) {
            setShowError(true)
            return
        }
        setSubmitSuccess(true)
    }

    const handleSelection = (item: any | null) => {
        var selectedId = categorySelect?.id
        if (selectedId === item?.id) {
            setIsVisible(false)
            return
        } else {
            setCategory(item)
            if (item.form == -1) {
                setContent("")
            } else setContent(jsonSvc.findLocalById(item.form.toString()))
            setIsVisible(false)
        }
    }
    const FILE_10MB = 10 * 1024 * 1024
    const FILE_30MB = 30 * 1024 * 1024

    const [listFile, setListFile] = useState<any[]>([])

    const isBiggerThan10mb = (element: any, index: number, array: any) => {
        return element.size > FILE_10MB
    }
    const isBiggerThan30mb = () => {
        let fileSize = 0
        listFile.forEach((item: any) => {
            fileSize += item.size
        })
        return fileSize > FILE_30MB ? true : false
    }
    const requestLibraryPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera")
                pickImage()
            } else {
                console.log("Camera permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const requestCameraPermission = async (type: string) => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera")
                type === "image" ? pickImageFromCamera() : pickVideoFromCamera()
            } else {
                console.log("Camera permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const pickImage = async () => {
        ImagePicker.openPicker({
            mediaType: "any",
            forceJpg: true,
            multiple: true,
            maxFiles: 9999,
        })
            .then(response => {
                setOptionPickImage(false)
                let inValid = false
                if (response.length > 5 || response.length > 5 - listFile.length) {
                    ErrorUtil.errorInquiryModal(true, "파일 첨부는 최대 5장까지 가능합니다.")
                    return
                }
                response.forEach(async (item: any) => {
                    if (item.mime.indexOf("video") !== -1) {
                        if (Platform.OS === "ios") {
                            await createThumbnail({
                                url: item.path,
                            }).then(res => {
                                console.log({ res })
                                if (listFile.length < 5) {
                                    if (
                                        item.mime.match(
                                            /(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/
                                        )[0] ===
                                        item.mime.match(/(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/)[1]
                                    ) {
                                        if (item.size <= FILE_10MB) {
                                            listFile.push({ ...item, thumbnail: res.path })
                                        }
                                    } else {
                                        inValid = true
                                    }
                                }
                            })
                        } else {
                            if (listFile.length < 5) {
                                if (
                                    item.mime.match(/(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/)[0] ===
                                    item.mime.match(/(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/)[1]
                                ) {
                                    if (item.size <= FILE_10MB) {
                                        listFile.push(item)
                                    }
                                } else {
                                    inValid = true
                                }
                            }
                        }
                    } else {
                        if (listFile.length < 5) {
                            if (
                                item.mime.match(/(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/)[0] ===
                                item.mime.match(/(jpg|jpeg|png|mp4|m4v|3gp|3g2|3gpp|3gpp2|wmv|asf|avi|flv|mkv|webm)$/)[1]
                            ) {
                                if (item.size <= FILE_10MB) {
                                    listFile.push(item)
                                }
                            } else {
                                inValid = true
                            }
                        }
                    }
                    setListFile([...listFile])
                })

                if (inValid) {
                    ErrorUtil.errorInquiryModal(true, "첨부 파일이 유효하지 않습니다.")
                    return
                }

                if (response.some(isBiggerThan10mb)) {
                    ErrorUtil.errorInquiryModal(true, "각 첨부 파일의 최대 용량은 10MB입니다.")
                    return
                }
            })
            .catch((error: any) => {
                console.log("ERROR IMAGE:", error)
                setOptionPickImage(false)
            })
    }
    const pickImageFromCamera = async () => {
        ImagePicker.openCamera({
            mediaType: "any",
            forceJpg: true,
        })
            .then(response => {
                setOptionPickImage(false)
                if (listFile.length < 5) {
                    if (response.size <= FILE_10MB) {
                        listFile.push(response)
                    } else {
                        ErrorUtil.errorInquiryModal(true, "각 첨부 파일의 최대 용량은 10MB입니다.")
                        return
                    }
                }
                setListFile([...listFile])
            })
            .catch((error: any) => {
                console.log("ERROR IMAGE:", error)
                setOptionPickImage(false)
            })
    }
    const pickVideoFromCamera = async () => {
        ImagePicker.openCamera({
            mediaType: "video",
            forceJpg: true,
        })
            .then(response => {
                if (Platform.OS === "ios") {
                    createThumbnail({
                        url: response.path,
                        //timeStamp: 10000,
                    })
                        .then(res => {
                            console.error({ res }), setOptionPickImage(false)
                            if (listFile.length < 5) {
                                if (response.size <= FILE_10MB) {
                                    listFile.push({ ...response, thumbnail: res.path })
                                } else {
                                    ErrorUtil.errorInquiryModal(true, "각 첨부 파일의 최대 용량은 10MB입니다.")
                                    return
                                }
                            }
                            setListFile([...listFile])
                        })
                        .catch(err => console.log({ err }))
                } else {
                    setOptionPickImage(false)
                    if (listFile.length < 5) {
                        if (response.size <= FILE_10MB) {
                            listFile.push({ ...response })
                        } else {
                            ErrorUtil.errorInquiryModal(true, "각 첨부 파일의 최대 용량은 10MB입니다.")
                            return
                        }
                    }
                    setListFile([...listFile])
                }
            })
            .catch((error: any) => {
                console.log("ERROR VIDEO:", error)
                setOptionPickImage(false)
            })
    }

    const createFormData = (photos: any[]) => {
        const data = new FormData()
        data.append("TITLE", titleInput)
        data.append(
            "CONTENT",
            contentInput.trim() +
                `\n\n디바이스 정보: ${deviceName}\nOS버전: ${versionOS}\n버디스쿼드 앱 버전: ${AppVersion}`
        )
        data.append("INQUIRY_TYPE", idInquiry)
        if (photos.length > 0) {
            const list: any[] = []
            photos.forEach(item => {
                const image = {
                    type: item.mime,
                    uri: Platform.OS === "ios" ? item.path.replace("file://", "") : item.path,
                    name: Platform.OS === "ios" ? item.filename ?? "imageUndefined" : "imageUndefined",
                }
                data.append("ATTACHED_FILES", image)
            })
        }
        return data
    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
            {loading ? (
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(360, 650),
                        position: "absolute",
                        zIndex: 1,
                        justifyContent: "center",
                    }}
                >
                    <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                </View>
            ) : null}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* <KeyboardAwareScrollView showsVerticalScrollIndicator={false}> */}
                <View
                    style={{
                        backgroundColor: Colors.WHITE,
                        alignItems: "center",

                        ...RatioUtil.padding(0, 20, 0, 20),
                    }}
                >
                    <View
                        style={{
                            width: RatioUtil.width(320),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "600",
                                color: Colors.GRAY18,
                                ...RatioUtil.padding(5, 0, 10, 0),
                            }}
                        >
                            {jsonSvc.findLocalById("173107")}
                            <PretendText style={{ fontSize: RatioUtil.font(14), color: Colors.RED }}>*</PretendText>
                        </PretendText>
                        <TouchableOpacity
                            onPress={() => {
                                setIsVisible(true)
                            }}
                            style={{
                                flexDirection: "row",

                                borderRadius: RatioUtil.width(8),
                                borderWidth: 1,
                                alignItems: "center",

                                borderColor: Colors.GRAY7,
                                ...RatioUtil.padding(0, 10, 0, 10),

                                height: RatioUtil.height(48),
                                justifyContent: "space-between",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "400",
                                    color: Colors.BLACK,
                                }}
                            >
                                {categorySelect?.label}
                            </PretendText>
                            <Image source={RaffleImg.drop_down} style={RatioUtil.size(12, 10)} resizeMode="contain" />
                        </TouchableOpacity>
                        <View style={{ height: 20 }} />

                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "600",
                                color: Colors.GRAY18,
                                ...RatioUtil.padding(0, 0, 5, 0),
                            }}
                        >
                            {jsonSvc.findLocalById("173108")}
                            <PretendText style={{ fontSize: RatioUtil.font(14), color: Colors.RED }}>*</PretendText>
                        </PretendText>
                        <View>
                            <TextInput
                                value={titleInput}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChangeText={(text: any) => {
                                    setTitle(text)
                                }}
                                style={{
                                    ...mineStyle.edit.input,
                                    borderWidth: 1,
                                    borderColor: isFocus ? Colors.PURPLE : Colors.GRAY7,
                                    height: RatioUtil.height(48),
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(14),
                                }}
                                cursorColor={Colors.PURPLE}
                                maxLength={20}
                                placeholderTextColor={Colors.GRAY3}
                            />
                            <PretendText style={{ ...mineStyle.edit.inputLength, bottom: RatioUtil.height(9) }}>
                                <PretendText
                                    style={{
                                        ...mineStyle.edit.inputLength,
                                        bottom: RatioUtil.height(9),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {titleInput.length}
                                </PretendText>
                                /20
                            </PretendText>
                        </View>
                        <View style={{ height: 20 }} />
                        <View>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    color: Colors.GRAY18,
                                    ...RatioUtil.padding(0, 0, 5, 0),
                                }}
                            >
                                {jsonSvc.findLocalById("173109")}
                                <PretendText style={{ fontSize: RatioUtil.font(14), color: Colors.RED }}>*</PretendText>
                            </PretendText>
                            <TextInput
                                onFocus={() => setIsFocusContent(true)}
                                onBlur={() => setIsFocusContent(false)}
                                value={contentInput}
                                onChangeText={(text: any) => {
                                    setContent(text)
                                }}
                                style={{
                                    ...mineStyle.edit.input,
                                    borderWidth: 1,
                                    borderColor: isFocusContent ? Colors.PURPLE : Colors.GRAY7,
                                    height: RatioUtil.height(190),
                                    textAlignVertical: "top",
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(14),
                                }}
                                cursorColor={Colors.PURPLE}
                                placeholderTextColor={Colors.GRAY3}
                                multiline={true}
                                numberOfLines={10}
                                // placeholder={"123"}
                                maxLength={1000}
                                textAlignVertical={"top"}
                                onContentSizeChange={event => {}}
                            />

                            <PretendText style={{ ...mineStyle.edit.inputLength, bottom: RatioUtil.height(9) }}>
                                <PretendText
                                    style={{
                                        ...mineStyle.edit.inputLength,
                                        bottom: RatioUtil.height(9),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {contentInput.length}
                                </PretendText>
                                /1,000
                            </PretendText>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                backgroundColor: Colors.WHITE3,
                                ...RatioUtil.margin(10),
                                ...RatioUtil.padding(15, 20, 15, 20),
                                ...RatioUtil.borderRadius(8),
                            }}
                        >
                            <View style={{ alignItems: "flex-start" }}>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.GRAY18,
                                        ...RatioUtil.padding(0, 0, 5, 0),
                                    }}
                                >
                                    {"디바이스 정보"}
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.GRAY18,
                                        ...RatioUtil.padding(0, 0, 5, 0),
                                    }}
                                >
                                    {"OS버전"}
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.GRAY18,
                                    }}
                                >
                                    {"버디스쿼드 앱 버전"}
                                </PretendText>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.BLACK,
                                        ...RatioUtil.padding(0, 0, 5, 0),
                                    }}
                                >
                                    {deviceName}
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.BLACK,
                                        ...RatioUtil.padding(0, 0, 5, 0),
                                    }}
                                >
                                    {versionOS}
                                </PretendText>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: "600",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {AppVersion}
                                </PretendText>
                            </View>
                        </View>
                        <View style={{ height: 20 }} />

                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "600",
                                color: Colors.GRAY18,
                                ...RatioUtil.padding(0, 0, 5, 0),
                            }}
                        >
                            {jsonSvc.findLocalById("173113")}
                        </PretendText>

                        {/* PICK FILE */}
                        <View
                            style={{
                                ...RatioUtil.size(320, 75),
                                flexDirection: "row",
                                alignItems: "center",
                                // backgroundColor: "red",
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={listFile}
                                    contentContainerStyle={{ paddingRight: 10 }}
                                    ListHeaderComponent={
                                        listFile.length < 5 ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setOptionPickImage(true)
                                                }}
                                                style={{
                                                    ...RatioUtil.size(65, 65),
                                                    borderRadius: RatioUtil.width(8),
                                                    borderWidth: 1,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderColor: Colors.GRAY7,
                                                    ...RatioUtil.margin(10, 5, 0, 0),
                                                    marginRight: RatioUtil.width(5),
                                                }}
                                            >
                                                <Image
                                                    source={RaffleImg.plus}
                                                    style={RatioUtil.size(20, 20)}
                                                    resizeMode="contain"
                                                />
                                            </TouchableOpacity>
                                        ) : null
                                    }
                                    renderItem={({ item, index }) => (
                                        <View
                                            key={index}
                                            style={{
                                                ...RatioUtil.size(65, 70),
                                                ...RatioUtil.margin(10, 10, 5, 0),
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        Platform.OS === "ios"
                                                            ? item.mime.includes("video")
                                                                ? item.thumbnail
                                                                : item.path
                                                            : item.path,
                                                }}
                                                style={{
                                                    ...RatioUtil.size(65, 65),
                                                    backgroundColor: Colors.GRAY,
                                                    borderRadius: 10,
                                                }}
                                                resizeMode="cover"
                                            />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    ///delete file
                                                    listFile.splice(index, 1)
                                                    setListFile([...listFile])
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    right: -5,
                                                    top: -5,
                                                }}
                                            >
                                                <Image
                                                    source={myPageImg.deleteInquiry}
                                                    style={{
                                                        ...RatioUtil.size(20, 20),
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        </View>
                        <View style={{ height: 10 }} />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "600",
                                color: Colors.GRAY18,
                                ...RatioUtil.padding(0, 0, 10, 0),
                            }}
                        >
                            {jsonSvc.findLocalById("173114")}
                        </PretendText>
                        <View style={{ height: 20 }} />
                    </View>
                </View>
                <View style={{ backgroundColor: Colors.GRAY9, ...RatioUtil.size(360, 10) }} />
                <View
                    style={{
                        backgroundColor: Colors.WHITE,
                        alignItems: "center",

                        ...RatioUtil.padding(0, 20, 0, 20),
                    }}
                >
                    <View
                        style={{
                            ...RatioUtil.size(320, 60),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => setCheck(!checkButton)}>
                            <Image
                                source={checkButton ? RaffleImg.on_button : RaffleImg.off_button}
                                style={RatioUtil.size(24, 24)}
                            />
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "600",
                                    top: 1,
                                    color: Colors.BLACK,
                                    ...RatioUtil.padding(0, 0, 0, 5),
                                }}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "700",
                                        color: Colors.BLACK,
                                        ...RatioUtil.padding(0, 0, 0, 5),
                                    }}
                                >
                                    {" "}
                                    {jsonSvc.findLocalById("13115")}
                                </PretendText>{" "}
                                {jsonSvc.findLocalById("173117")}
                            </PretendText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsPolicy(true)}>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: "700",
                                    bottom: 2,
                                    color: Colors.GRAY18,
                                    borderBottomWidth: 1.3,
                                    borderBottomColor: Colors.GRAY18,
                                }}
                            >
                                {jsonSvc.findLocalById("13113")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 20 }} />
                    <TouchableOpacity
                        onPress={() => {
                            const fileAmountCheck = isBiggerThan30mb()

                            if (fileAmountCheck)
                                ErrorUtil.errorInquiryModal(true, "첨부할 수 있는 용량은 최대 30MB 입니다.")
                            else {
                                submitInquiry(createFormData(listFile))
                                setCheck(false)
                            }
                            // setSubmitSuccess(true)
                        }}
                        disabled={titleInput == "" ? true : contentInput == "" ? true : checkButton ? false : true}
                        style={{
                            ...RatioUtil.size(320, 60),
                            backgroundColor:
                                titleInput == ""
                                    ? Colors.GRAY7
                                    : contentInput == ""
                                    ? Colors.GRAY7
                                    : checkButton
                                    ? Colors.BLACK
                                    : Colors.GRAY7,

                            alignItems: "center",
                            justifyContent: "center",
                            ...RatioUtil.borderRadius(50),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: "700",
                                color:
                                    titleInput == ""
                                        ? Colors.GRAY18
                                        : contentInput == ""
                                        ? Colors.GRAY18
                                        : checkButton
                                        ? Colors.WHITE
                                        : Colors.GRAY18,
                            }}
                        >
                            {jsonSvc.findLocalById("173105")}
                        </PretendText>
                    </TouchableOpacity>
                    <View style={{ height: 20 }} />
                </View>
                {/* </KeyboardAwareScrollView> */}
            </ScrollView>

            {/* Drop down category */}
            <Modal animationType="fade" statusBarTranslucent transparent={true} style={{ flex: 1 }} visible={isVisible}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: `${Colors.BLACK}90`,
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            ...RatioUtil.size(360, 400),
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            alignItems: "center",
                            backgroundColor: Colors.WHITE,
                        }}
                    >
                        <View style={{ ...RatioUtil.size(360, 60), justifyContent: "center" }}>
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(18),
                                    color: Colors.BLACK,
                                    fontWeight: "700",
                                }}
                            >
                                {jsonSvc.findLocalById("173107")}
                            </PretendText>
                            <Pressable
                                style={{ position: "absolute", right: RatioUtil.width(15) }}
                                onPress={() => {
                                    setIsVisible(false)
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(30, 30)}
                                    source={nftDetailImg.close}
                                />
                            </Pressable>
                        </View>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                            data={listCategory ?? []}
                            extraData={categorySelect?.id}
                            keyExtractor={(item: any) => item.id}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleSelection(item)
                                        setIdInquiry(index + 1)
                                    }}
                                    style={{
                                        ...RatioUtil.size(360, 60),
                                        ...RatioUtil.padding(0, 20, 0, 20),
                                        justifyContent: "center",
                                        backgroundColor: item.id == categorySelect?.id ? Colors.WHITE3 : Colors.WHITE,
                                    }}
                                >
                                    <PretendText>{item.label}</PretendText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
            {/* option pick file */}
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{ flex: 1 }}
                visible={optionPickImage}
            >
                <Pressable
                    onPress={() => {
                        setOptionPickImage(false)
                    }}
                    style={{
                        flex: 1,
                        backgroundColor: `${Colors.BLACK}90`,
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            ...RatioUtil.size(360, 150),
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            alignItems: "center",
                            backgroundColor: Colors.WHITE,
                        }}
                    >
                        <View style={{ ...RatioUtil.size(360, 60), justifyContent: "center" }}>
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(18),
                                    color: Colors.BLACK,
                                    fontWeight: "700",
                                }}
                            >
                                {/* {jsonSvc.findLocalById("173107")} */}
                            </PretendText>
                            <Pressable
                                style={{ position: "absolute", right: RatioUtil.width(15) }}
                                onPress={() => {
                                    setOptionPickImage(false)
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(30, 30)}
                                    source={nftDetailImg.close}
                                />
                            </Pressable>
                        </View>
                        <View
                            style={{
                                ...RatioUtil.size(320, 80),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Pressable
                                style={{
                                    ...RatioUtil.size(65, 65),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderColor: Colors.GRAY7,
                                }}
                                onPress={() => {
                                    if (
                                        Platform.OS === "android" &&
                                        (Platform.constants["Release"] === "11" ||
                                            Platform.constants["Release"] === "12")
                                    ) {
                                        // console.error("VER: ", Platform.constants["Release"])
                                        requestLibraryPermission()
                                    } else {
                                        pickImage()
                                    }
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(35, 35)}
                                    source={InquiryImg.inquiry_library}
                                />
                                <PretendText style={{ color: Colors.GRAY3, paddingTop: 10 }}>
                                    {/* 갤러리 */}
                                    사진 선택
                                </PretendText>
                            </Pressable>
                            <Pressable
                                style={{
                                    ...RatioUtil.size(65, 65),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderColor: Colors.GRAY7,
                                }}
                                onPress={() => {
                                    if (
                                        Platform.OS === "android" &&
                                        (Platform.constants["Release"] === "11" ||
                                            Platform.constants["Release"] === "12")
                                    ) {
                                        requestCameraPermission("image")
                                    } else {
                                        pickImageFromCamera()
                                    }
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(35, 35)}
                                    source={InquiryImg.inquiry_camera1}
                                />
                                <PretendText style={{ color: Colors.GRAY3, paddingTop: 10 }}>
                                    {/* 카메라 */}
                                    사진 찍기
                                </PretendText>
                            </Pressable>
                            <Pressable
                                style={{
                                    ...RatioUtil.size(65, 65),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderColor: Colors.GRAY7,
                                }}
                                onPress={() => {
                                    if (
                                        Platform.OS === "android" &&
                                        (Platform.constants["Release"] === "11" ||
                                            Platform.constants["Release"] === "12")
                                    ) {
                                        requestCameraPermission("video")
                                    } else {
                                        pickVideoFromCamera()
                                    }
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    style={RatioUtil.size(35, 35)}
                                    source={InquiryImg.inquiry_video}
                                />
                                <PretendText style={{ color: Colors.GRAY3, paddingTop: 10 }}>비디오</PretendText>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Policy Detail */}

            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{ flex: 1 }}
                visible={isPolicy}
                onRequestClose={() => setIsPolicy(false)}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View
                        style={{
                            ...RatioUtil.size(360, 80),
                            justifyContent: "center",
                            backgroundColor: Colors.WHITE,
                        }}
                    >
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(18),
                                color: Colors.BLACK,
                                fontWeight: "700",
                            }}
                        >
                            {jsonSvc.findLocalById("173117")}
                        </PretendText>
                        <Pressable
                            style={{ position: "absolute", right: RatioUtil.width(15) }}
                            onPress={() => setIsPolicy(false)}
                        >
                            <Image resizeMode="contain" style={RatioUtil.size(30, 30)} source={nftDetailImg.close} />
                        </Pressable>
                    </View>
                    <ScrollView
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}90`,
                        }}
                        contentContainerStyle={{
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                backgroundColor: Colors.WHITE,
                            }}
                        >
                            <PretendText
                                style={{
                                    width: RatioUtil.width(320),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "500",
                                    color: Colors.GRAY2,
                                    marginBottom: RatioUtil.height(20),
                                }}
                            >
                                {/* (주)카카오VX는 이용자 문의를 처리하기 위해 다음과 같이 개인정보를 수집 및 이용하며,
                                이용자의 개인정보를 안전하게 취급하는데 최선을 다하고 있습니다. */}
                                {jsonSvc.findLocalById("173118")}
                            </PretendText>
                            <PretendText
                                style={{
                                    width: RatioUtil.width(320),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "500",
                                    color: Colors.GRAY2,
                                    marginBottom: RatioUtil.height(20),
                                }}
                            >
                                {/* 귀하께서는 개인정보 수집 및 이용에 대한 동의를 거부하실 수 있으나, 동의를 거부하실 경우 회원가입, 
                               서비스 이용을 하실 수 없습니다. 자세한 내용에 대해서는 개인정보처리방침을 참고하시길 바랍니다. */}
                                {jsonSvc.findLocalById("173120")}
                            </PretendText>
                            <PretendText
                                style={{
                                    width: RatioUtil.width(320),
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "500",
                                    color: Colors.GRAY2,
                                    marginBottom: RatioUtil.height(20),
                                }}
                            >
                                {/* 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                                이용 목적이 변경되는 경우 개인정보 보호법에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다. */}

                                {jsonSvc.findLocalById("173122")}
                            </PretendText>

                            <View style={RatioUtil.padding(15, 20, 0, 20)}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderTopColor: Colors.GRAY11,
                                        borderTopWidth: 1,
                                        borderBottomColor: Colors.GRAY11,
                                        borderBottomWidth: 1,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: Colors.WHITE3,
                                            ...rankStyle.header.center,
                                            ...RatioUtil.size(107, 42),
                                            borderLeftWidth: 1,
                                            borderLeftColor: Colors.GRAY11,
                                        }}
                                    >
                                        <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                            {/* 수집항목 */}
                                            {jsonSvc.findLocalById("173119")}
                                        </PretendText>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: Colors.WHITE3,
                                            ...rankStyle.header.center,
                                            ...RatioUtil.size(107, 42),
                                            borderLeftWidth: 1,
                                            borderLeftColor: Colors.GRAY11,
                                        }}
                                    >
                                        <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                            {jsonSvc.findLocalById("173121")}
                                        </PretendText>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: Colors.WHITE3,
                                            ...rankStyle.header.center,
                                            ...RatioUtil.size(107, 42),
                                            borderLeftWidth: 1,
                                            borderLeftColor: Colors.GRAY11,
                                            borderRightWidth: 1,
                                            borderRightColor: Colors.GRAY11,
                                        }}
                                    >
                                        <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                            {jsonSvc.findLocalById("173123")}
                                        </PretendText>
                                    </View>
                                </View>
                                {/*  */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderTopColor: Colors.GRAY11,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.GRAY11,
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173124")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.GRAY11,
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173125")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                borderRightWidth: 1,
                                                borderRightColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            ></PretendText>
                                        </View>
                                    </View>
                                </View>
                                {/*  */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderTopColor: Colors.GRAY11,
                                        borderBottomColor: Colors.GRAY11,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 250),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173127")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 250),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173125")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 250),
                                                flexDirection: "row",
                                                // alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                borderRightWidth: 1,
                                                borderRightColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(10),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                    position: "absolute",
                                                    width: "100%",

                                                    left: RatioUtil.width(10),
                                                    top: RatioUtil.height(-20),
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173126")}
                                            </PretendText>
                                        </View>
                                    </View>
                                </View>
                                {/*  */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderTopColor: Colors.GRAY11,
                                        borderTopWidth: 1,
                                        borderBottomColor: Colors.GRAY11,
                                        borderBottomWidth: 1,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173128")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(5),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173138")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                ...RatioUtil.size(107, 150),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderLeftWidth: 1,
                                                borderLeftColor: Colors.GRAY11,
                                                borderRightWidth: 1,
                                                borderRightColor: Colors.GRAY11,
                                                paddingLeft: RatioUtil.width(10),
                                                paddingRight: RatioUtil.width(10),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...rankStyle.listItem.textBold,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {jsonSvc.findLocalById("173139")}
                                            </PretendText>
                                        </View>
                                    </View>
                                </View>
                                {/*  */}

                                <PretendText
                                    style={{
                                        width: RatioUtil.width(320),
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: "500",
                                        color: Colors.GRAY2,
                                        marginTop: RatioUtil.height(20),
                                        marginBottom: RatioUtil.height(40),
                                    }}
                                >
                                    {/* 위 동의를 거부할 권리가 있으며, 동의를 거부하실 경우 문의 처리 및 결과 회신이
                                    제한됩니다. */}
                                    {jsonSvc.findLocalById("173140")}
                                </PretendText>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Submit success Inquiry */}
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                style={{
                    flex: 1,
                }}
                visible={submitSuccess}
            >
                <View style={walletStyle.header.modalMainView}>
                    <View
                        style={{
                            width: RatioUtil.lengthFixedRatio(272),
                            ...RatioUtil.borderRadius(16),
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: Colors.WHITE,
                        }}
                    >
                        <Image
                            source={NFTCardImages.selected}
                            style={{
                                width: RatioUtil.lengthFixedRatio(50),
                                height: RatioUtil.lengthFixedRatio(50),
                                marginTop: RatioUtil.lengthFixedRatio(30),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                            }}
                        />
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(16),
                                lineHeight: RatioUtil.font(16) * 1.4,
                                color: Colors.BLACK,
                                marginLeft: RatioUtil.lengthFixedRatio(20),
                                marginRight: RatioUtil.lengthFixedRatio(20),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                            }}
                        >
                            {jsonSvc.findLocalById("10000059")}
                        </PretendText>
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(14),
                                lineHeight: RatioUtil.font(14) * 1.4,
                                marginHorizontal: RatioUtil.lengthFixedRatio(20),
                                color: Colors.BLACK,
                                fontWeight: "400",
                            }}
                        >
                            {jsonSvc.findLocalById("10000060")}
                        </PretendText>
                        <TouchableOpacity
                            onPress={() => {
                                setSubmitSuccess(false)
                                setTitle("")
                                setContent("")
                                setIdInquiry(1)
                                setCategory(listCategory[0])
                                setListFile([])
                                onSelect(1)
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(232, 48),
                                ...RatioUtil.marginFixedRatio(30, 20, 30, 20),
                                ...RatioUtil.borderRadius(100),
                                backgroundColor: Colors.BLACK,

                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(14),
                                    color: Colors.WHITE,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                }}
                            >
                                {jsonSvc.findLocalById("10010000")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                style={{ flex: 1 }}
                animationType="fade"
                transparent={true}
                visible={showError}
                onRequestClose={() => setShowError(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: `${Colors.BLACK}90`,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            width: RatioUtil.width(250),
                            height: RatioUtil.height(180),
                            borderRadius: RatioUtil.width(15),
                            alignItems: "center",
                            justifyContent: "space-around",
                        }}
                    >
                        <View
                            style={{
                                height: RatioUtil.height(50),
                                justifyContent: "center",
                                marginTop: RatioUtil.height(20),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(16),
                                }}
                            >
                                {"문의 등록에 실패했습니다.\n 문의 내용을 다시 확인해주세요."}
                            </PretendText>
                        </View>

                        <CustomButton
                            style={{
                                width: "80%",
                                backgroundColor: Colors.BLACK,
                                borderRadius: RatioUtil.width(20),
                                height: RatioUtil.height(40),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => setShowError(false)}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    textAlign: "center",
                                }}
                            >
                                확인
                            </PretendText>
                        </CustomButton>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default PostInquiry
