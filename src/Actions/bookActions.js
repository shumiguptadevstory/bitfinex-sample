import { GET_CRYPTO_BOOK } from "./types"

//get Book
export const getBook = (book) => async (dispatch) => {
	dispatch({
		type: GET_CRYPTO_BOOK,
		payload: book,
	})
}
