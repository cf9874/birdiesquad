import { useDispatch } from "react-redux"
import { createAction } from "typesafe-actions"
import { UserInfo, IsLogin, IsFirst } from "./types"
export const ISLOGIN = "store/reducers/sign.reducer/ISLOGIN"
export const USER_INFO = "store/reducers/sign.reducer/USER_INFO"
export const ISFIRST = "store/reducers/sign.reducer/ISFIRST"

// export const WATCHER = "store/reducers/sign.reducer/USER_INFO"
// export const SUCCESS = "store/reducers/sign.reducer/USER_INFO"
// export const ERROR = "store/reducers/sign.reducer/USER_INFO"

export const setIsLogin = createAction(ISLOGIN)<IsLogin>()
export const setUserInfo = createAction(USER_INFO)<UserInfo>()
export const setIsFirst = createAction(ISFIRST)<IsFirst>()
// export const apicallWatcher = createAction(WATCHER)()
// export const apicallSuccess = createAction(SUCCESS)()
// export const apicallFailer = createAction(ERROR)()

// export const getPeople = () => {
//     return async (dispatch) => {
//         try {
//             const starWarsPromise = await fetch('https://swapi.co/api/people');
//             apicallWatcher(data);
//             const people = await starWarsPromise.json();
//             console.log('people-----------', people);
//             apicallSuccess(people)
//           } catch(error) {
//             console.log('Getting People Error---------', error);
//             apicallFailer(error)
//           }
//     }
// }
