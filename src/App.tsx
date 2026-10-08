function App() {
	return (
		<div
			className="flex justify-center items-center w-96 h-48
			bg-gray-200"
		>
			<button
				type="button"
				className="px-4 py-2
				text-white font-semibold
				bg-blue-500 hover:bg-blue-600 rounded-md"
				onClick={async () => {
					let [tab] = await chrome.tabs.query({ active: true });
					chrome.scripting.executeScript({
						target: { tabId: tab.id as number },
						func: async () => {
							const blocks = [
								...document.querySelectorAll(
									"div.title.font-size-125.mb-lg-2"
								),
							];

							const orderInfo = blocks.find((div) => {
								return div.textContent?.trim() === "订单信息";
							})?.nextSibling?.firstChild?.childNodes;

							const orderId = (
								Array.from(orderInfo as any).find(
									(div: any) => {
										return div.textContent
											?.trim()
											.startsWith("订单ID");
									}
								) as any
							)?.textContent?.trim();

							const deliveryEmail = blocks
								.find((div) => {
									return (
										div.textContent?.trim() === "配送信息"
									);
								})
								?.nextSibling?.firstChild?.textContent?.trim();

							const paymentInfoDiv = blocks.find((div) => {
								return (
									div.textContent?.trim() === "订单支付信息"
								);
							})?.nextSibling?.firstChild;

							let paymentPlatform = undefined;
							if (paymentInfoDiv) {
								paymentPlatform = (
									Array.from(
										paymentInfoDiv?.childNodes as any
									).find((div: any) => {
										return div.textContent
											?.trim()
											.startsWith("渠道类型");
									}) as any
								)?.textContent?.trim();
							}

							const currency: string =
								(
									Array.from(orderInfo as any).find(
										(div: any) => {
											return div.textContent
												?.trim()
												.startsWith("币种");
										}
									) as any
								)?.textContent
									?.trim()
									.replace("币种：", "") ?? "";
							const actuallyPaid =
								paymentInfoDiv?.childNodes[2].textContent?.replace(
									"实扣金额：",
									"实扣金额：" + currency + " "
								);

							const transactionId =
								paymentInfoDiv?.childNodes[0].textContent;
							const paymentPlatformName =
								paymentInfoDiv?.childNodes[4].textContent;
							const paymentPlatformAccount =
								paymentInfoDiv?.childNodes[6].textContent;
							const paymentPlatformTransactionId =
								paymentInfoDiv?.childNodes[5].textContent;

							const licenseContent = blocks.find((div) => {
								return (
									div.textContent?.trim() === "license列表"
								);
							})?.nextSibling;

							let license = "";

							if (licenseContent) {
								if (licenseContent.textContent?.trim() === "") {
									license = "License: 暂无license";
								} else {
									const licenses = Array.from(
										licenseContent.childNodes as any
									)
										.filter((obj: any) => {
											return (
												obj.textContent.trim() !== ""
											);
										})
										.map((a: any) => {
											return a.textContent.trim();
										});

									license = "License: ";
									for (const l of licenses) {
										license = license + "\n" + l;
									}
								}
							}

							const postScript =
								paymentInfoDiv?.childNodes[11].textContent;

							const info =
								"--------- 订单信息 ---------" +
								"\n" +
								orderId +
								"\n\n" +
								"--------- 配送信息 ---------" +
								"\n" +
								deliveryEmail +
								"\n\n" +
								"------- 订单支付信息 -------" +
								(paymentPlatform
									? "\n" +
									  paymentPlatform +
									  "\n" +
									  actuallyPaid +
									  "\n" +
									  paymentPlatformName +
									  "\n" +
									  paymentPlatformAccount +
									  "\n" +
									  transactionId +
									  "\n" +
									  paymentPlatformTransactionId +
									  "\n" +
									  postScript
									: "\n无") +
								"\n\n" +
								"-------- Licenses --------" +
								"\n" +
								license;
							console.log(info);
							await navigator.clipboard.writeText(info);
						},
					});
				}}
			>
				Copy Info
			</button>
		</div>
	);
}

export default App;
