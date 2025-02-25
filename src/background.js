// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  // Send toggle message to the content script
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
}); 