// `chrome.tabs.query` acts as a safety net, checking for existing Google Meet tabs when the extension is just installed or updated & there was a Google Meet tab opened before that.
chrome.tabs.query({ currentWindow: true }, (tabs) => {
  // Code this later.
})

// `chrome.tabs.onUpdated.addListener` listens for future tab changes, catching newly opened Google Meet tabs.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const googleMeetPattern = /meet\.google\.com\/(.+)/
  if (changeInfo.status !== "complete") return

  if (tab.url && googleMeetPattern.test(tab.url)) {
    chrome.storage.local.set({ isGoogleMeetLink: true })
  }
})

// `chrome.alarms.create` creates an alarm every second
chrome.alarms.create("start-countdown", {
  periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "start-countdown") {
    chrome.storage.local.get(["remainingTime", "isRunning"], (res) => {
      if (res.isRunning) {
        let remainingTime = res.remainingTime - 1
        chrome.storage.local.set({ remainingTime })
        const remainingHours = Math.floor(remainingTime / 3600)
        const remainingMinutes = Math.floor((remainingTime / 60) % 60)
        const remainingSeconds = Math.floor(remainingTime % 60)
        chrome.action.setBadgeText({
          text: `${remainingHours}:${remainingMinutes}`,
        })
      }
    })
  }
})

// Initializing the vars in the local storage.
chrome.storage.local.get(["remainingTime", "isRunning"], (res) => {
  chrome.storage.local.set({
    remainingTime: "remainingTime" in res ? res.remainingTime : 3600,
    isRunning: "isRunning" in res ? res.isRunning : false,
    isGoogleMeetLink: "isGoogleMeetLink" in res ? res.isGoogleMeetLink : false,
  })
})
