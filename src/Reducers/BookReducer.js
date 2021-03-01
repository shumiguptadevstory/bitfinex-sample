import { GET_CRYPTO_BOOK } from "../Actions/types"

const initialState = {
	book: [],
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_CRYPTO_BOOK:
			return {
				book: payload,
			}
		default:
			return state
	}
}
