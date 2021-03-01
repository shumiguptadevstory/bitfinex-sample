import { combineReducers } from "redux"
import cryptoReducer from "./CryptoReducer"
import bookReducer from "./BookReducer"

export default combineReducers({
	tickers: cryptoReducer,
	books: bookReducer,
})
