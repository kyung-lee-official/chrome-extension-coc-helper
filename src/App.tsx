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
					const [tab] = await chrome.tabs.query({
						active: true,
						currentWindow: true,
					});
					if (tab?.id === undefined) return;

					const [injection] = await chrome.scripting.executeScript({
						target: { tabId: tab.id },
						func: () => {
							const appOrderDetail =
								document.querySelector("app-order-detail");

							const orderInfoElement =
								appOrderDetail?.children[0]?.children[0]
									?.children[0]?.children[1]?.children[0]
									?.children[0];

							const orderInfoLabels = [
								"订单编号",
								"下单时间",
								"订单金额",
								"运费",
								"实付金额",
								"支付方式",
							];

							let orderInfoText =
								orderInfoElement?.textContent ?? "";

							for (const label of orderInfoLabels) {
								orderInfoText = orderInfoText
									.split(`${label}：`)
									.join(`\n${label}：`);
							}

							orderInfoText = orderInfoText.trim();

							const licenseElement =
								appOrderDetail?.children[0]?.children[0]
									?.children[7]?.children[1]?.children[0];

							let license = "";

							if (licenseElement) {
								if (licenseElement.textContent?.trim() === "") {
									license = "License: 暂无license";
								} else {
									const licenses = Array.from(
										licenseElement.childNodes as any
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

							const info =
								"--------- 订单信息 ---------" +
								"\n" +
								orderInfoText +
								"\n\n" +
								"-------- 密钥信息 --------" +
								"\n" +
								license;
							console.log(info);
							return info;
						},
					});

					const copiedInfo = injection?.result;
					if (copiedInfo) {
						await navigator.clipboard.writeText(copiedInfo);
					}
				}}
			>
				Copy Info
			</button>
		</div>
	);
}

export default App;
