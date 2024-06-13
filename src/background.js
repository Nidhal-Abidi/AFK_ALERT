/* function hasOpenGoogleMeetTab() {
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
  let data = await chrome.storage.local.get(["isGoogleMeetLink"])
  if ("isGoogleMeetLink" in data && data["isGoogleMeetLink"] === true) {
    console.log("Opened a google meet tab some time in the past!")
    return true
  }
  return false
}
*/

// `chrome.tabs.onUpdated.addListener` listens for future tab changes, catching newly opened Google Meet tabs.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const googleMeetPattern = /meet\.google\.com\/(.+)/
  if (changeInfo.status !== "complete") return

  if (tab.url && googleMeetPattern.test(tab.url)) {
    saveToLocalStorage({ isGoogleMeetLink: true, autoTimerStartsIn: 30 })
    createAlarm("google-meet", 1 / 60)
  }
})

//createAlarm("start-countdown", 1 / 60)

chrome.alarms.onAlarm.addListener((alarm) => {
  /* if (!hasOpenGoogleMeetTab() && hadOpenGoogleMeetTab()) {
    // The user has an open Google meet tab then closed it. We should restart the timer
    console.log("The timer is reset")
    saveToLocalStorage({
      remainingTime: 3600,
      isRunning: false,
      isGoogleMeetLink: false,
      autoTimerStartsIn: 30,
    })
    clearAlarm("google-meet")
    clearAlarm("start-countdown")
  } */

  if (alarm.name === "google-meet") {
    chrome.storage.local.get(["autoTimerStartsIn"], (res) => {
      if (!"autoTimerStartsIn" in res) return

      const sessionCountDown = res["autoTimerStartsIn"]
      if (sessionCountDown === 0) {
        clearAlarm("google-meet")
        createAlarm("start-countdown", 1 / 60)
        saveToLocalStorage({ isRunning: true })
      } else {
        saveToLocalStorage({ autoTimerStartsIn: sessionCountDown - 1 })
        displayBadgeText((sessionCountDown - 1).toString())
      }
    })
  } else if (alarm.name === "start-countdown") {
    chrome.storage.local.get(["remainingTime", "isRunning"], (res) => {
      if (!"isRunning" in res || res.isRunning === false) return
      if (!"remainingTime" in res) return

      if (res.remainingTime === 0) {
        saveToLocalStorage({ remainingTime: 3600, isRunning: false })
        clearAlarm("start-countdown")
        sendNotification()
        displayBadgeText("")
      } else {
        let remainingTime = res.remainingTime - 1
        saveToLocalStorage({ remainingTime })
        displayBadgeText(getBadgeTextForRemainingTime(remainingTime))
      }
    })
  }
})

// Initializing the vars in the local storage.
initializeTimer()

function displayBadgeText(text) {
  chrome.action.setBadgeText({ text })
}

function saveToLocalStorage(obj) {
  chrome.storage.local.set(obj)
}

function sendNotification() {
  const notificationMessages = [
    "404 Break Not Found!",
    "Compiling Coffee... BRB",
    "Code Reviews Later!",
    "API Throttled: Chill for a Bit",
  ]
  const randomIdx = Math.floor(Math.random() * notificationMessages.length)
  this.registration.showNotification(notificationMessages[randomIdx])
}

function getBadgeTextForRemainingTime(remainingTime) {
  const remainingHours = Math.floor(remainingTime / 3600)
  const remainingMinutes = Math.floor((remainingTime / 60) % 60)
  const remainingSeconds = Math.floor(remainingTime % 60)

  let badgeText = `${remainingHours}:${remainingMinutes}`
  if (remainingHours === 0 && remainingMinutes === 0) {
    badgeText = remainingSeconds.toString()
  }
  return badgeText
}

function createAlarm(name, periodInMinutes) {
  // `chrome.alarms.create` creates an alarm every second
  chrome.alarms.create(name, { periodInMinutes })
}

function clearAlarm(name) {
  chrome.alarms.clear(name)
}

function initializeTimer() {
  chrome.storage.local.get(
    ["remainingTime", "isRunning", "isGoogleMeetLink", "autoTimerStartsIn"],
    (res) => {
      if (
        !"remainingTime" in res ||
        !"isRunning" in res ||
        !"isGoogleMeetLink" in res ||
        !"autoTimerStartsIn" in res
      )
        return
      saveToLocalStorage({
        remainingTime: "remainingTime" in res ? res.remainingTime : 3600,
        isRunning: "isRunning" in res ? res.isRunning : false,
        isGoogleMeetLink:
          "isGoogleMeetLink" in res ? res.isGoogleMeetLink : false,
        autoTimerStartsIn:
          "autoTimerStartsIn" in res ? res.autoTimerStartsIn : 30,
      })
    }
  )
}
