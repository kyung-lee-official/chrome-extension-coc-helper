function App() {
	return (
		<div
			className="flex justify-center items-center w-96 h-48
			bg-gray-200"
		>
			<button
				className="px-4 py-2
				text-white font-semibold
				bg-blue-500 hover:bg-blue-600 rounded-md"
				onClick={async () => {
					let [tab] = await chrome.tabs.query({ active: true });
					chrome.scripting.executeScript({
						target: { tabId: tab.id as number },
						func: async () => {
							const deliveryEmail = [
								...document.querySelectorAll(
									"div.title.font-size-125.border-bottom.mb-lg-2"
								),
							]
								.find((div) => {
									return (
										div.textContent?.trim() === "配送信息"
									);
								})
								?.nextSibling?.firstChild?.textContent?.trim();

							const orderInfoDiv = [
								...document.querySelectorAll(
									"div.title.font-size-125.border-bottom.mb-lg-2"
								),
							].find((div) => {
								return div.textContent?.trim() === "订单信息";
							})?.nextSibling?.firstChild;
							const paymentInfoDiv = [
								...document.querySelectorAll(
									"div.title.font-size-125.border-bottom.mb-lg-2"
								),
							].find((div) => {
								return (
									div.textContent?.trim() === "订单支付信息"
								);
							})?.nextSibling?.firstChild;
							const paymentPlatform =
								paymentInfoDiv?.childNodes[3].textContent;
							const currency: string =
								orderInfoDiv?.childNodes[9].textContent?.replace(
									"币种：",
									""
								) ?? "";
							const actuallyPaid =
								paymentInfoDiv?.childNodes[2].textContent?.replace(
									"实扣金额：",
									"实扣金额：" + currency + " "
								);
							const orderId =
								paymentInfoDiv?.childNodes[0].textContent;
							const paymentPlatformName =
								paymentInfoDiv?.childNodes[4].textContent;
							const paymentPlatformAccount =
								paymentInfoDiv?.childNodes[6].textContent;
							const paymentPlatformOrderId =
								paymentInfoDiv?.childNodes[5].textContent;
							const license =
								"License: " +
								[
									...document.querySelectorAll(
										"div.title.font-size-125.border-bottom.mb-lg-2"
									),
								].find((div) => {
									return (
										div.textContent?.trim() ===
										"license列表"
									);
								})?.nextSibling?.childNodes[1].firstChild
									?.textContent;
							const postScript =
								paymentInfoDiv?.childNodes[11].textContent;

							const info =
								paymentPlatform +
								"\n" +
								actuallyPaid +
								"\n" +
								deliveryEmail +
								"\n" +
								paymentPlatformName +
								"\n" +
								paymentPlatformAccount +
								"\n" +
								orderId +
								"\n" +
								paymentPlatformOrderId +
								"\n" +
								postScript +
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
