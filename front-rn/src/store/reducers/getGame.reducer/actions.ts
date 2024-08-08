import { createAction } from "typesafe-actions"
import { gameData } from "."
export const SET_GAME = "store/reducers/getGame.reducer/SET_GAME";
export const SET_SHOW_GAME_MODAL = "store/reducers/getGame.reducer/SET_SHOW_GAME_MODAL";
export const SET_SHOW_GAME_MODAL_DATA = "store/reducers/getGame.reducer/SET_SHOW_GAME_MODAL_DATA";
export const SET_LOADER = "store/reducers/getGame.reducer/SET_LOADER";

export const setGetGameData = createAction(SET_GAME)
<gameData>()
export const setShowGameModal = createAction(SET_SHOW_GAME_MODAL)
<gameData>()
export const setSetGameModalData = createAction(SET_SHOW_GAME_MODAL_DATA)
<gameData>()
export const setGameLoader = createAction(SET_LOADER)
<gameData>()

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
