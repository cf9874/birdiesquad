export const ObjectUtil = {
    //언디파인 널 제거
    removeTrash: <T extends {}>(obj: T) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
    },

    setFormData: (obj: { [key: string]: any } = {}, formdata = new FormData()) => {
        for (const key in obj) {
            formdata.append(`${key}`, obj[key])
        }

        // const formdata = setFormData({
        //   key1: data1,
        //   key2: data2,
        //   key3: data3,
        // })

        return formdata
    },
}
