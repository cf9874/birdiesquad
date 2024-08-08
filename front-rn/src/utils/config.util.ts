import { S3, NFT_S3 } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NFTCardImages, myPageImg, playerCardImg, profileImg } from "assets/images"
import { IconType } from "const"
import { Image, PermissionsAndroid, Platform } from "react-native"
import { ImagePickerResponse } from "react-native-image-picker"
import nftPlayerJson from "json/nft_player.json"
import nftGradeJson from "json/nft_grade.json"
type Keys = string | string[]

export const ConfigUtil = {
    getProfile: (name?: string, type?: number) => {
        if (!name || type === IconType.BASIC) {
            // return { uri: Image.resolveAssetSource(profileImg.profile).uri, name: "string", type: IconType.BASIC }
            return {
                profile: {
                    uri: Image.resolveAssetSource(profileImg.profile).uri,
                    name: "",
                    type: IconType.BASIC,
                },
                background: {
                    uri: Image.resolveAssetSource(profileImg.profile).uri,
                },
            }
        } else {
            const [, personId, gradeId] = name.split("_")
            // name, 2023_1639663_1_seq
            const player = nftPlayerJson.find(v => v.nPersonID === Number(personId))
            const grade = nftGradeJson.find(v => v.nID === Number(gradeId))

            return {
                profile: { uri: NFT_S3 + player?.sPlayerthumbnailImagePath, name, type },
                background: {
                    uri: grade
                        ? NFT_S3 + grade.sThumbnailBackgroundPath
                        : Image.resolveAssetSource(profileImg.profile).uri,
                },
            }
        }
    },

    getPlayerImage: (name?: string): string => {
        if (!name) {
            return Image.resolveAssetSource(playerCardImg.blank).uri
        } else {
            // return icon.name
            return NFT_S3 + name
        }
    },

    // 값이 없으면 null stirng 반환
    getStorage: async <P>(keys: Keys): Promise<Keys extends Array<any> ? Array<P | null> : P | null> => {
        const checkItem = (item: string | null) => {
            // return item !== null && item !== "null" ? JSON.parse(item) : null

            if (item !== null && item !== "null") {
                try {
                    return JSON.parse(item)
                } catch (error) {
                    return item
                }
            } else {
                return null
            }
        }

        if (Array.isArray(keys)) {
            let list = []

            for (const key of keys) {
                const item = await AsyncStorage.getItem(key)

                list.push(checkItem(item))
            }

            return list as P
        } else {
            const item = await AsyncStorage.getItem(keys)

            return checkItem(item) as P | null
        }
    },

    setStorage: async <P>(obj: { [key: string]: P }) => {
        for (const key in obj) {
            await AsyncStorage.setItem(key, `${obj[key]}`)
        }
    },
    removeStorage: async (keys: string[] | string) => {
        if (Array.isArray(keys)) {
            for (const key of keys) {
                await AsyncStorage.removeItem(key)
            }
        } else {
            await AsyncStorage.removeItem(keys)
        }
    },
}
