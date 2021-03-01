import axios from "axios"
import React, { useEffect, useState } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useSelector, useDispatch } from "react-redux"
import { getTicker } from "../Actions/cryptoActions"
import { getBook } from "../Actions/bookActions"

const client = new W3CWebSocket("wss://api-pub.bitfinex.com/ws/2")
const clientBook = new W3CWebSocket("wss://api-pub.bitfinex.com/ws/2")

export default function Home() {
	const dispatch = useDispatch()
	const tickers = useSelector((state) => state.tickers.crypto)
	const books = useSelector((state) => state.books.book)
	const [connection, setConnection] = useState(false)
	let counter = 0
	let counter2 = 0
	useEffect(() => {
		const getTick = () => {
			client.onmessage = (msg) => {
				let parsedTicker = JSON.parse(msg.data)
				if (Array.isArray(parsedTicker) && parsedTicker.length == 2) {
					// console.log(parsedTicker)
					dispatch(getTicker(parsedTicker))
				}
			}

			let msg = JSON.stringify({
				event: "subscribe",
				channel: "ticker",
				chanId: 99,
				symbol: "tBTCUSD",
				prec: "P0",
				freq: "F3",
				len: "25",
				pair: "BTCUSD",
				name: "book-top",
			})
			client.onopen = () => {
				client.send(msg)
			}
			// if (connection) {
			// 	client.close()
			// }
		}
		const getbook = () => {
			let arr = []
			let msg = JSON.stringify({
				event: "subscribe",
				channel: "book",
				prec: "P0",
				freq: "F0",
				len: 25,
				symbol: "tBTCUSD",
			})
			clientBook.onmessage = (msg) => {
				// console.log(
				// 	JSON.parse(msg.data),
				// 	typeof msg.data,
				// 	JSON.parse(msg.data).length
				// )
				let parsed = JSON.parse(msg.data)
				// console.log(parsed)
				// console.log("new parsed")
				// console.log(arr)
				if (Array.isArray(parsed) && parsed[1]?.length == 50) {
					arr.push(parsed)
					// console.log(arr)
					// console.log("new book")
				} else {
					arr[1] &&
						arr[1].map((val) => {
							if (val[0] == parsed[1][0]) {
								console.log(val[0], parsed[1][0])
								val = parsed[1]
							}
						})
					// console.log(arr)
					// console.log("book changed")
				}
				// console.log(tickers.crypto, )
				dispatch(getBook(arr))
			}

			clientBook.onopen = () => {
				arr = []
				clientBook.send(msg)
			}
		}

		getTick()
		getbook()
	}, [])
	return (
		<>
			<div className="body_container row" id="interface">
				<div className="sidebar slideout" id="sidebar">
					<div>
						<div className="ui-panel bg-wrap bfxui-main-ticker ticker-sidebar-selected">
							<div className="table-wrapper">
								<table className="ticker-sidebar-box">
									<tbody>
										<tr>
											<td className="col-id" rowSpan={3} style={{ width: 44 }}>
												<span
													className="svg svg-background BTC"
													style={{
														width: 40,
														height: 40,
														flex: "0 0 40px",
														backgroundImage:
															'url("https://static.bitfinex.com/images/icons/BTC-alt.svg")',
													}}
												/>
											</td>
											<td className="col-id" rowSpan={1} style={{ width: 136 }}>
												<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-help">
													<h5 className>
														<span className>
															<span>BTC</span>
															<span className="show-soft">/</span>
															<span>USD</span>
														</span>
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-info-circle fa-fw" />
														</button>
													</h5>
												</span>
											</td>
											<td className="col-id" rowSpan={1}>
												<h5>
													<span className=" ">
														{tickers[1] && tickers[1][2]}
													</span>
												</h5>
											</td>
										</tr>
										<tr>
											<td className="col-id" rowSpan={1} style={{ width: 18 }}>
												<span className="show-soft">VOL</span>
												<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-help">
													<span className=" ">415,704,161</span>
												</span>
												<span className="show-soft">USD</span>
											</td>
											<td className="col-id" rowSpan={1}>
												<span className="bfx-red-text">
													<span className=" ">
														{tickers[1] && tickers[1][7]?.toFixed(2)}
													</span>
													<i className="fa fa-caret-down fa-fw" />(
													<span className=" ">
														{tickers[1] && tickers[1][5]?.toFixed(2)}
													</span>
													%)
												</span>
											</td>
										</tr>
										<tr>
											<td className="col-id" rowSpan={1} style={{ width: 18 }}>
												<span className="show-soft">LOW</span>
												<span className=" ">{tickers[1] && tickers[1][9]}</span>
											</td>
											<td className="col-id" rowSpan={1}>
												<span className="show-soft">HIGH</span>
												<span className=" ">{tickers[1] && tickers[1][8]}</span>
											</td>
										</tr>
										<tr
											style={{
												borderTop: "1px solid rgba(100, 100, 100, 0.3)",
												cursor: "pointer",
											}}
										>
											<td
												className="col-id"
												rowSpan={1}
												style={{ width: 44 }}
											/>
											<td
												className="col-id"
												rowSpan={1}
												colSpan={2}
												style={{ width: 136 }}
											>
												<div className="ranking__container">
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-help">
														Your
														<span className>
															<span>BTC</span>
															<span className="show-soft">/</span>
															<span>USD</span>
														</span>
														Rank
													</span>
													<span className="ranking__number">N/A</span>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
								<span className="santiment-button">
									<img
										src="https://trading.bitfinex.com/static/media/san-graph.18297575.svg"
										alt="Santiment Button Graph"
										className="santiment-button-graph"
										height={12}
									/>
									<img
										src="https://trading.bitfinex.com/static/media/san-icon.3f9989ad.svg"
										alt="Santiment Button Icon"
										height={15}
									/>
								</span>
							</span>
						</div>
						<div className="ui-panel bg-wrap" id="balances-sidebar" />
						<div className="ui-panel bg-wrap" id="summary-sidebar" />
						<div className="ui-panel bg-wrap" />
					</div>
				</div>
				<div className="main-app-container" id="app-page-content">
					<div className="global-message" />
					<div>
						<div className="ui-panel bg-wrap" id="chart-header" />
						<div className="ui-panel bg-wrap" />
						<div className="ui-panel bg-wrap" />
						<div className="ui-panel bg-wrap" />
						<div className="split__container">
							<div className="split__main">
								<div className="ui-panel bg-wrap">
									<div
										className="collapsible book__panel"
										style={{ minHeight: 32 }}
									>
										<div className="ui-collapsible__header">
											<div>
												<i
													className="fa fa-chevron-down fa-fw"
													style={{
														width: "0.8rem",
														opacity: "0.6",
														marginRight: 5,
													}}
												/>
												<span className="ui-collapsible__title">
													Order Book
												</span>
												<span className="show50">
													<span className>
														<span>BTC</span>
														<span className="show-soft">/</span>
														<span>USD</span>
													</span>
												</span>
											</div>
											<div style={{ visibility: "visible" }}>
												<span
													id="book-agg-controls"
													className="bfx-collapsible-header"
												>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-minus fa-fw" />
														</button>
													</span>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear ui-button--disabled"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-plus fa-fw" />
														</button>
													</span>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-bell fa-fw" />
														</button>
													</span>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-gear fa-fw" />
														</button>
													</span>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-search-minus fa-fw" />
														</button>
													</span>
													<span className="trigger ui-tooltip ui-tooltip--underline ui-tooltip--cursor-pointer">
														<button
															type="button"
															className="ui-button ui-button--size-XS ui-button--clear"
															style={{ padding: "0px 2px 2px" }}
														>
															<i className="fa fa-search-plus fa-fw" />
														</button>
													</span>
												</span>
											</div>
										</div>
										<div className="ui-collapsible__body-wrapper">
											<div
												className="ui-collapsible__body"
												style={{ padding: "0px 5px 10px" }}
											>
												<div className="book__main">
													<div
														id="book-bids"
														className="bookViz-green book__side"
													>
														<div
															className="show50 book__header"
															style={{
																flexDirection: "row",
																justifyContent: "space-between",
															}}
														>
															<div
																style={{
																	width: 15,
																	minWidth: 15,
																	maxWidth: 15,
																	textAlign: "center",
																	padding: 0,
																}}
															/>
															<div
																style={{
																	width: 15,
																	minWidth: 15,
																	maxWidth: 15,
																	textAlign: "center",
																	padding: 0,
																}}
															/>
															<div
																style={{
																	width: 40,
																	minWidth: 40,
																	maxWidth: 40,
																	textAlign: "center",
																}}
															>
																Count
															</div>
															<div style={{ minWidth: "25%" }}>Amount</div>
															<div
																style={{
																	width: 65,
																	minWidth: 65,
																	maxWidth: 65,
																}}
															>
																Total
															</div>
															<div style={{ minWidth: "25%" }}>Price</div>
														</div>
														<div style={{}} className="book__bars">
															<svg
																style={{
																	width: "100%",
																	height: 408,
																	transform: "scale(-1, 1)",
																	zIndex: 0,
																	pointerEvents: "none",
																}}
															>
																{books[0] &&
																	books[0][1]
																		?.slice(0, 25)
																		.map((book, index) => {
																			counter2 = counter2 + 17
																			return (
																				<>
																					<rect
																						x={1}
																						y={counter2}
																						width="100%"
																						key={index}
																						transform="scale(0 1)"
																						height={17}
																						fillOpacity="0.2"
																					/>
																					<rect
																						x={1}
																						y={counter2}
																						key={index + book[2]}
																						width="100%"
																						transform={`scale(${book[2]} 1)`}
																						height={17}
																						fillOpacity="0.2"
																					/>
																				</>
																			)
																		})}
																{/* <rect
																	x={1}
																	y={17}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={17}
																	width="100%"
																	transform="scale(0.0017515758087699583 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={34}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={34}
																	width="100%"
																	transform="scale(0.006546382546831662 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={51}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={51}
																	width="100%"
																	transform="scale(0.032563721904422006 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={68}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={68}
																	width="100%"
																	transform="scale(0.041553999292756744 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={85}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={85}
																	width="100%"
																	transform="scale(0.04436437434850447 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={102}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={102}
																	width="100%"
																	transform="scale(0.1635804842133229 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={119}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={119}
																	width="100%"
																	transform="scale(0.18726675573262325 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={136}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={136}
																	width="100%"
																	transform="scale(0.23733381948774854 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={153}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={153}
																	width="100%"
																	transform="scale(0.38767192660509037 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={170}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={170}
																	width="100%"
																	transform="scale(0.3996595814053823 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={187}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={187}
																	width="100%"
																	transform="scale(0.4475905274190847 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={204}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={204}
																	width="100%"
																	transform="scale(0.48278002039711754 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={221}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={221}
																	width="100%"
																	transform="scale(0.4967292737065455 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={238}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={238}
																	width="100%"
																	transform="scale(0.5171432760364859 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={255}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={255}
																	width="100%"
																	transform="scale(0.7513890407990285 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={272}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={272}
																	width="100%"
																	transform="scale(0.7633766955993204 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={289}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={289}
																	width="100%"
																	transform="scale(0.787354007873169 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={306}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={306}
																	width="100%"
																	transform="scale(0.7986877873231903 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={323}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={323}
																	width="100%"
																	transform="scale(0.8698644139275784 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={340}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={340}
																	width="100%"
																	transform="scale(0.926071915042533 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={357}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={357}
																	width="100%"
																	transform="scale(0.9309186878636755 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={374}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={374}
																	width="100%"
																	transform="scale(0.9429082537190052 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={391}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={391}
																	width="100%"
																	transform="scale(0.996417794780442 1)"
																	height={17}
																	fillOpacity="0.2"
																/> */}
															</svg>
														</div>
														<div className="book__rows">
															{books[0] &&
																books[0][1]?.slice(0, 25).map((book, index) => (
																	<div className="book__row" key={index}>
																		<div
																			className="book__placeholder"
																			style={{
																				width: 15,
																				minWidth: 15,
																				maxWidth: 15,
																				textAlign: "center",
																				padding: 0,
																			}}
																		/>
																		<div
																			className="book__alert"
																			style={{
																				width: 15,
																				minWidth: 15,
																				maxWidth: 15,
																				textAlign: "center",
																				padding: 0,
																			}}
																		>
																			<i className="fa fa-bell fa-fw show50" />
																		</div>
																		<div
																			style={{
																				width: 40,
																				minWidth: 40,
																				maxWidth: 40,
																				textAlign: "center",
																			}}
																		>
																			{book[1]}
																		</div>
																		<div style={{ minWidth: "25%" }}>
																			<span className=" ">{book[2]}</span>
																		</div>
																		<div
																			style={{
																				width: 65,
																				minWidth: 65,
																				maxWidth: 65,
																			}}
																		>
																			<span className=" ">{book[2]}</span>
																		</div>
																		<div style={{ minWidth: "25%" }}>
																			<span className=" ">{book[0]}</span>
																		</div>
																	</div>
																))}
														</div>
													</div>
													<div
														id="book-asks"
														className="bookViz-red book__side"
													>
														<div
															className="show50 book__header"
															style={{
																flexDirection: "row-reverse",
																justifyContent: "space-between",
															}}
														>
															<div
																style={{
																	width: 15,
																	minWidth: 15,
																	maxWidth: 15,
																	textAlign: "center",
																	padding: 0,
																}}
															/>
															<div
																style={{
																	width: 15,
																	minWidth: 15,
																	maxWidth: 15,
																	textAlign: "center",
																	padding: 0,
																}}
															/>
															<div
																style={{
																	width: 40,
																	minWidth: 40,
																	maxWidth: 40,
																	textAlign: "center",
																}}
															>
																Count
															</div>
															<div style={{ minWidth: "25%" }}>Amount</div>
															<div
																style={{
																	width: 65,
																	minWidth: 65,
																	maxWidth: 65,
																}}
															>
																Total
															</div>
															<div style={{ minWidth: "25%" }}>Price</div>
														</div>
														<div style={{}} className="book__bars">
															<svg
																style={{
																	width: "100%",
																	height: 408,
																	transform: "scale(1, 1)",
																	zIndex: 0,
																	pointerEvents: "none",
																}}
															>
																{books[0] &&
																	books[0][1]
																		?.slice(26, 50)
																		.map((book, index) => {
																			counter = counter + 17
																			return (
																				<>
																					<rect
																						x={1}
																						y={counter}
																						key={index}
																						width="100%"
																						transform={`scale(0, 1)`}
																						height={17}
																						fillOpacity="0.2"
																					/>

																					<rect
																						x={1}
																						y={counter}
																						width="100%"
																						key={index + book[2]}
																						transform={`scale( ${
																							book[2] * -1
																						},1)`}
																						height={17}
																						fillOpacity="0.2"
																					/>
																				</>
																			)
																		})}
																{/* 
																<rect
																	x={1}
																	y={17}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={17}
																	width="100%"
																	transform="scale(0.07804202100662275 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={34}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={34}
																	width="100%"
																	transform="scale(0.07808698700751471 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={51}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={51}
																	width="100%"
																	transform="scale(0.07812071150818369 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={68}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={68}
																	width="100%"
																	transform="scale(0.07816567750907565 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={85}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={85}
																	width="100%"
																	transform="scale(0.08252699738458852 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={102}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={102}
																	width="100%"
																	transform="scale(0.08256072188525751 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={119}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={119}
																	width="100%"
																	transform="scale(0.08259444638592647 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={136}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={136}
																	width="100%"
																	transform="scale(0.08263941238681843 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={153}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={153}
																	width="100%"
																	transform="scale(0.08268437838771041 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={170}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={170}
																	width="100%"
																	transform="scale(0.08386473591112444 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={187}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={187}
																	width="100%"
																	transform="scale(0.0929009348278701 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={204}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={204}
																	width="100%"
																	transform="scale(0.09293465932853907 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={221}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={221}
																	width="100%"
																	transform="scale(0.09297962532943103 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={238}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={238}
																	width="100%"
																	transform="scale(0.10452362757852249 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={255}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={255}
																	width="100%"
																	transform="scale(0.10456859357941445 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={272}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={272}
																	width="100%"
																	transform="scale(0.10482704691104122 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={289}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={289}
																	width="100%"
																	transform="scale(0.11812005010327654 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={306}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={306}
																	width="100%"
																	transform="scale(0.13005852334009288 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={323}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={323}
																	width="100%"
																	transform="scale(0.13010348934098484 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={340}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={340}
																	width="100%"
																	transform="scale(0.18110730000271683 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={357}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={357}
																	width="100%"
																	transform="scale(0.18114102450338582 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={374}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={374}
																	width="100%"
																	transform="scale(0.23369503804586825 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={391}
																	width="100%"
																	transform="scale(0 1)"
																	height={17}
																	fillOpacity="0.2"
																/>
																<rect
																	x={1}
																	y={391}
																	width="100%"
																	transform="scale(0.23528347776547714 1)"
																	height={17}
																	fillOpacity="0.2"
																/> */}
															</svg>
														</div>
														<div className="book__rows">
															{books[0] &&
																books[0][1]?.slice(25, 50).map((book) => (
																	<div className="book__row book__row--reversed">
																		<div
																			className="book__placeholder"
																			style={{
																				width: 15,
																				minWidth: 15,
																				maxWidth: 15,
																				textAlign: "center",
																				padding: 0,
																			}}
																		/>
																		<div
																			className="book__alert"
																			style={{
																				width: 15,
																				minWidth: 15,
																				maxWidth: 15,
																				textAlign: "center",
																				padding: 0,
																			}}
																		>
																			<i className="fa fa-bell fa-fw show50" />
																		</div>
																		<div
																			style={{
																				width: 40,
																				minWidth: 40,
																				maxWidth: 40,
																				textAlign: "center",
																			}}
																		>
																			{book[1]}
																		</div>
																		<div style={{ minWidth: "25%" }}>
																			<span>{book[2]}</span>
																		</div>
																		<div
																			style={{
																				width: 65,
																				minWidth: 65,
																				maxWidth: 65,
																			}}
																		>
																			<span className=" ">{book[2]}</span>
																		</div>
																		<div style={{ minWidth: "25%" }}>
																			<span className=" ">{book[0]}</span>
																		</div>
																	</div>
																))}
															{/* <div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0106</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.388</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,889</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.389</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,890</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0006</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.390</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,891</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.391</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,892</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0776</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.468</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,893</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0006</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.469</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,894</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0006</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.469</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,895</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.470</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,896</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.471</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,897</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	6
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0210</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.492</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,898</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.1608</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.653</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,899</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0006</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.653</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,900</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.654</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,901</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.2054</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.860</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,902</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.860</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,903</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0046</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">1.865</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,904</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.2365</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">2.101</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,905</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.2124</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">2.314</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,906</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	4
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0008</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">2.315</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,907</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	7
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.9074</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">3.222</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,908</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	3
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0006</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">3.223</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,909</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.9350</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">4.158</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,910</span>
																</div>
															</div>
															<div className="book__row book__row--reversed">
																<div
																	className="book__placeholder"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																/>
																<div
																	className="book__alert"
																	style={{
																		width: 15,
																		minWidth: 15,
																		maxWidth: 15,
																		textAlign: "center",
																		padding: 0,
																	}}
																>
																	<i className="fa fa-bell fa-fw show50" />
																</div>
																<div
																	style={{
																		width: 40,
																		minWidth: 40,
																		maxWidth: 40,
																		textAlign: "center",
																	}}
																>
																	5
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">0.0283</span>
																</div>
																<div
																	style={{
																		width: 65,
																		minWidth: 65,
																		maxWidth: 65,
																	}}
																>
																	<span className=" ">4.186</span>
																</div>
																<div style={{ minWidth: "25%" }}>
																	<span className=" ">46,911</span>
																</div>
															</div>*/}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
