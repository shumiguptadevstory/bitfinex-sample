import React from "react"
import Home from "./Components/Home"
import { Provider } from "react-redux"
import store from "./Store"
import "./App.css"
function App() {
	return (
		<Provider store={store}>
			<div className="ticker-side dark-theme sidebar-left">
				<Home />
			</div>
		</Provider>
	)
}

export default App
