let isActive = false;

// Function to update a specific tab
async function updateTab(tabId: number) {
  try {
    console.log(`Updating tab ${tabId} with isActive=${isActive}`);
    await chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_BUBBLE', isActive });
  } catch (error) {
    console.error(`Error updating tab ${tabId}:`, error);
  }
}

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked');
  isActive = !isActive;
  
  // Update the extension icon
  const icon = isActive ? 'icons/icon-32.png' : 'icons/icon-32-inactive.png';
  await chrome.action.setIcon({ path: icon });

  // Update all tabs
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  console.log(`Updating ${tabs.length} tabs`);
  
  for (const tab of tabs) {
    if (tab.id) {
      updateTab(tab.id);
    }
  }
});

// Handle new tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  if (isActive && tab.id) {
    console.log(`New tab created: ${tab.id}`);
    // Wait for the tab to be ready
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        updateTab(tabId);
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isActive) {
    console.log(`Tab updated: ${tabId}`);
    updateTab(tabId);
  }
}); 