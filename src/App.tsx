function App() {
	return (
		<div
			className="flex justify-center items-center w-96 h-80 
			bg-gray-200"
		>
			<button
				className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
				onClick={async () => {
					let [tab] = await chrome.tabs.query({ active: true });
					chrome.scripting.executeScript({
						target: { tabId: tab.id as number },
						func: () => {
							alert("hello from my extension");
						},
					});
				}}
			>
				Alert
			</button>
		</div>
	);
}

export default App;
