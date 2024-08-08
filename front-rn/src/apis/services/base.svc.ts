export const ABaseScv = <T>() => {
    return class ABaseScv {
        private static _instance: T

        public static get instance() {
            return this._instance || (this._instance = new this() as T)
        }

        public static create(i: T) {
            this._instance = i
        }
    }
}

export const WBaseScv = <T>() => {
    return class WBaseScv {
        private static _instance: T

        public static get instance() {
            return this._instance || (this._instance = new this() as T)
        }

        public static create(i: T) {
            this._instance = i
        }
    }
}

// export class ABaseScv {
//     private static _instance: ABaseScv

//     public static get instance() {
//         return this._instance || (this._instance = new this())
//     }
// }
