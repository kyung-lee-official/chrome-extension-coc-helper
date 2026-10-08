const ORDER_URL_PREFIX =
	"https://ncoc.chuangbide.com/mall/order-details?orderId=";

const activeIcons = {
	16: "icons/icon-active-16.png",
	32: "icons/icon-active-32.png",
	48: "icons/icon-active-48.png",
	128: "icons/icon-active-128.png",
};

const inactiveIcons = {
	16: "icons/icon-16.png",
	32: "icons/icon-32.png",
	48: "icons/icon-48.png",
	128: "icons/icon-128.png",
};

async function updateAction(tabId: number, url?: string) {
	const available = !!url && url.startsWith(ORDER_URL_PREFIX);

	await chrome.action.setIcon({
		tabId,
		path: available ? activeIcons : inactiveIcons,
	});

	if (available) {
		await chrome.action.enable(tabId);
	} else {
		await chrome.action.disable(tabId);
	}
}

async function updateTab(tabId: number) {
	const tab = await chrome.tabs.get(tabId);
	await updateAction(tabId, tab.url);
}

async function refreshAllTabs() {
	const tabs = await chrome.tabs.query({});
	await Promise.all(
		tabs.map((tab) => (tab.id !== undefined ? updateAction(tab.id, tab.url) : undefined))
	);
}

chrome.runtime.onInstalled.addListener(() => {
	void refreshAllTabs();
});

chrome.runtime.onStartup.addListener(() => {
	void refreshAllTabs();
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
	void updateTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.active && (changeInfo.status === "complete" || changeInfo.url)) {
		void updateAction(tabId, tab.url);
	}
});
