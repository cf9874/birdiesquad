export default Object.freeze({
    check: require("./check.json"),
    loadingToast: require("./loading-toast.json"),
    loading: require("./loading.json"),
    warning: require("./warning.json"),
    arrow: require("./arrow.json"),
})

export const upgradeBtn: { [key: number]: any } = {
    1: require("./upgrade-common.json"), //common -> uncommon
    2: require("./upgrade-uncommon.json"), //uncommon ->rare
    3: require("./upgrade-rare.json"), //rare -> superRare
    4: require("./upgrade-superrare"), //superRare -> commingsoon
}
