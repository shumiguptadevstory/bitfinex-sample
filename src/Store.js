import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import RootReducer from "./Reducers"
import Thunk from "redux-thunk"

const store = createStore(
	RootReducer,
	composeWithDevTools(applyMiddleware(Thunk))
)

export default store
