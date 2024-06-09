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

// `chrome.alarms.create` schedules code to run periodically or at a specified time in the future.
chrome.alarms.create("start-timer", {
  periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "start-timer") {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      if (res.isRunning) {
        let timer = res.timer - 1
        chrome.storage.local.set({ timer })
      }
    })
  }
})

// Initializing the vars in the local storage.
chrome.storage.local.get(["timer", "isRunning"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 3600,
    isRunning: "isRunning" in res ? res.isRunning : false,
    isGoogleMeetLink: "isGoogleMeetLink" in res ? res.isGoogleMeetLink : false,
  })
})
