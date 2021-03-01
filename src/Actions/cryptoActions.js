import { GET_CRYPTO_TICKER } from "./types"

//get Ticker
export const getTicker = (crypto) => async (dispatch) => {
	dispatch({
		type: GET_CRYPTO_TICKER,
		payload: crypto,
	})
}
