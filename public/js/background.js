// Runs in background
// Sends messages to content.js to interact with webpage
let userId;
let currTabId = null;
let prevTabId = null;


// Sends data on tab change
chrome.tabs.onActivated.addListener(info => {
    // update current/prev tab id
    prevTabId = currTabId;
    currTabId = info.tabId;
    // check if user switched google accounts
    chrome.identity.getProfileUserInfo(userInfo => {
        userId = userInfo.id.toString();
        // Send message to old tab to stop timer
        chrome.tabs.sendMessage(prevTabId, { message: "clearInterval", tabId: prevTabId, userId: userId });
        // Send message to new tab to start a new timer
        chrome.tabs.sendMessage(currTabId, { message: "changeTab", tabId: currTabId, userId: userId });
    })
})

// Sends data on url change
chrome.tabs.onUpdated.addListener((activeTab, {}, tab) => {
    // check if user switched google accounts
    chrome.identity.getProfileUserInfo(userInfo => {
        userId = userInfo.id.toString();
        // Send message to tab to stop timer and send data
        chrome.tabs.sendMessage(currTabId, { message: "clearInterval", tabId: currTabId, userId: userId });
        // Then send message to tab to start a new timer
        chrome.tabs.sendMessage(currTabId, { message: "changeUrl", tabId: currTabId, userId: userId });
        
    })
})

