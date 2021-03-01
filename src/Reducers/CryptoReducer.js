import { GET_CRYPTO_TICKER } from "../Actions/types"

const initialState = {
	crypto: [],
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_CRYPTO_TICKER:
			return {
				crypto: payload,
			}
		default:
			return state
	}
}
