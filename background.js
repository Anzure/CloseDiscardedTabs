chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.discarded) {
    chrome.tabs.remove(tabId);
  }
});
