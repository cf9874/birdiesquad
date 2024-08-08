import { useCallback, useEffect, useState } from "react"
import { PermissionsAndroid, Platform } from "react-native"
import { CameraRoll, GetPhotosParams } from "@react-native-camera-roll/camera-roll"

export const hasAndroidPermission = async () => {
    const permission =
        Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE

    const hasPermission = await PermissionsAndroid.check(permission)
    if (hasPermission) {
        return true
    }

    const status = await PermissionsAndroid.request(permission)
    return status === "granted"
}

export interface Photo {
    uri: string
    type: string
    name: string
    group_name: string
}

export interface Album {
    group_name: string
    photoes: Photo[]
}

export const usePhoto = () => {
    const [photoes, setPhotoes] = useState<Photo[]>([])

    const getGallery = useCallback(async () => {
        try {
            const options: GetPhotosParams = {
                first: 1000,
                assetType: "Photos",
            }
            const { edges } = await CameraRoll.getPhotos(options)

            const photoes = edges.map(v => ({
                uri: Platform.OS === "android" ? v.node.image.uri : v.node.image.uri.replace("file://", ""),
                type: v.node.type,
                name: v.node.image.uri.split("/").pop() ?? "",
                group_name: v.node.group_name ?? "",
            }))

            setPhotoes(prev => [...prev, ...photoes])
        } catch (error) {
            console.log(error)
        }
    }, [photoes])

    useEffect(() => {
        if (photoes.length == 0) {
            getGallery()
        }
    }, [getGallery, photoes])

    return { photoes, setPhotoes, getGallery }
}

export default usePhoto
