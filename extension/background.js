// Function to block a URL instantly
const blockUrl = (tabId, url) => {
    chrome.tabs.update(tabId, { url: "http://localhost:5173/blocked" });
};

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; 

    const url = details.url;
    if (!url.startsWith('http') || url.includes('localhost')) return;

    try {
        const response = await fetch("http://localhost:8000/api/nsfw/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        const data = await response.json();

        if (data.blocked) {
            blockUrl(details.tabId, url);
        }
    } catch (err) {
        console.error("SecureSphere Core Offline");
    }
});