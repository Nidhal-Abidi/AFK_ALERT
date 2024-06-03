// Runs seperately from the main browser thread
// It won't have access to the content of the webpage
// Can interact with the extension using the extension messaging system

// `chrome.tabs.query` acts as a safety net, checking for existing Google Meet tabs when the extension is just installed or updated & there was a Google Meet tab opened before that.
chrome.tabs.query({ currentWindow: true }, (tabs) => {
  // Code this later.
})

// `chrome.tabs.onUpdated.addListener` listens for future tab changes, catching newly opened Google Meet tabs.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const googleMeetPattern = /meet\.google\.com\/.+/
  if (changeInfo.status !== "complete") return

  if (tab.url && googleMeetPattern.test(tab.url)) {
    const matches = tab.url.match(googleMeetPattern)
    const urlParameter = matches[matches.length - 1]

    console.log("**[Google Meet]: TIMER CAN BE STARTED**")
    // Send a message to the extension mentionning that we're currently inside a new google meeting.
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      meetingId: urlParameter,
    })
  }
})
