let closedTabs = [];

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (!changeInfo.discarded) {
    return;
  }
  chrome.tabs.get(tabId, function (tab) {
    closedTabs.push(tab.url);
    updateStorage();
    chrome.tabs.remove(tabId);
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get(["tabs"], (data) => {
    var oldTabs = JSON.parse(data.tabs);
    oldTabs.forEach(function (tabUrl) {
      chrome.tabs.create({
        url: tabUrl,
      });
    });
  });
  resetStorage();
  updateStorage();
});

function resetStorage() {
  closedTabs = [];
  chrome.storage.local.clear(["tabs"]);
}

function updateStorage() {
  var saveTabs = JSON.stringify(closedTabs);
  chrome.storage.local.set({ tabs: saveTabs });
  updateBadge();
}

function updateBadge() {
  chrome.action.setBadgeText({ text: `${closedTabs.length}` });
}

function loadStorage() {
  try {
    chrome.storage.local.get(["tabs"], (data) => {
      closedTabs = JSON.parse(data.tabs);
      updateBadge();
    });
  } catch (error) {
    resetStorage();
    updateStorage();
  }
}

loadStorage();
