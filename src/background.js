function hasOpenGoogleMeetTab() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const googleMeetPattern = /meet\.google\.com\/(.+)/
    for (let tab of tabs) {
      if (googleMeetPattern.test(tab.url)) {
        return true
      }
    }
    console.log("Google Meet tab is not open!!")
    return false
  })
}

async function hadOpenGoogleMeetTab() {
  let res = await chrome.storage.local.get(["isGoogleMeetLink"])
  if ("isGoogleMeetLink" in res && res["isGoogleMeetLink"] === true) {
    console.log("Opened a google meet tab some time in the past!")
    return true
  }
  return false
}

// `chrome.tabs.onUpdated.addListener` listens for future tab changes, catching newly opened Google Meet tabs.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const googleMeetPattern = /meet\.google\.com\/(.+)/
  if (changeInfo.status !== "complete") return

  if (tab.url && googleMeetPattern.test(tab.url)) {
    chrome.storage.local.set({ isGoogleMeetLink: true, automaticTimerIn: 30 })
    chrome.alarms.create("google-meet", {
      periodInMinutes: 1 / 60,
    })
  }
})

// `chrome.alarms.create` creates an alarm every second
chrome.alarms.create("start-countdown", {
  periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
  /* if (!hasOpenGoogleMeetTab() && hadOpenGoogleMeetTab()) {
    // The user has an open Google meet tab then closed it. We should restart the timer
    console.log("The timer is reset")
    chrome.storage.local.set({
      remainingTime: 3600,
      isRunning: false,
      isGoogleMeetLink: false,
      automaticTimerIn: 30,
    })
    chrome.alarms.clear("google-meet")
    chrome.alarms.clear("start-countdown")
  } */

  if (alarm.name === "google-meet") {
    chrome.storage.local.get(["automaticTimerIn"], (res) => {
      if (res["automaticTimerIn"] == 0) {
        chrome.alarms.clear("google-meet")
        chrome.storage.local.set({ isRunning: true })
      } else {
        chrome.storage.local.set({
          automaticTimerIn: res["automaticTimerIn"] - 1,
        })
        chrome.action.setBadgeText({
          text: (res["automaticTimerIn"] - 1).toString(),
        })
      }
    })
  } else if (alarm.name === "start-countdown") {
    chrome.storage.local.get(["remainingTime", "isRunning"], (res) => {
      if (res.isRunning) {
        let remainingTime = res.remainingTime - 1
        chrome.storage.local.set({ remainingTime })
        const remainingHours = Math.floor(remainingTime / 3600)
        const remainingMinutes = Math.floor((remainingTime / 60) % 60)
        chrome.action.setBadgeText({
          text: `${remainingHours}:${remainingMinutes}`,
        })
      }
    })
  }
})

// Initializing the vars in the local storage.
chrome.storage.local.get(
  ["remainingTime", "isRunning", "isGoogleMeetLink", "automaticTimerIn"],
  (res) => {
    chrome.storage.local.set({
      remainingTime: "remainingTime" in res ? res.remainingTime : 3600,
      isRunning: "isRunning" in res ? res.isRunning : false,
      isGoogleMeetLink:
        "isGoogleMeetLink" in res ? res.isGoogleMeetLink : false,
      automaticTimerIn: "automaticTimerIn" in res ? res.automaticTimerIn : 30,
    })
  }
)
