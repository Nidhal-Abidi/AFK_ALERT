const startBtn = document.querySelector("#start-timer")
const resetBtn = document.querySelector("#reset-timer")
const description = document.querySelector("#description")
const timerContainer = document.querySelector("#timer-container")

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    saveToLocalStorage({ isRunning: !res.isRunning })
  })
})

resetBtn.addEventListener("click", () => {
  saveToLocalStorage({ isRunning: false, remainingTime: 3600 })
  displayBadgeText("")
})

updatePopup()
setInterval(updatePopup, 1000)

function updatePopup() {
  updateStartPauseBtn()
  updateTimerContainer()
  updateTextDescription()
}

function updateStartPauseBtn() {
  chrome.storage.local.get(["isRunning"], (res) => {
    startBtn.textContent = res.isRunning ? "Pause Timer" : "Start Timer"
  })
}

function updateTimerContainer() {
  chrome.storage.local.get(["remainingTime"], (res) => {
    let remainingTime = res["remainingTime"]
    const [hours, minutes, seconds] = updateTime(remainingTime)
    timerContainer.innerHTML = hours + "h " + minutes + "m " + seconds + "s"
  })
}

function updateTextDescription() {
  chrome.storage.local.get(["isGoogleMeetLink", "autoTimerStartsIn"], (res) => {
    if (res["isGoogleMeetLink"]) {
      let text = ""
      if ("autoTimerStartsIn" in res && res["autoTimerStartsIn"] > 0) {
        text = `Timer starts automatically in ${res["autoTimerStartsIn"]}`
      }

      description.innerHTML =
        "I hope you have a productive meeting!!<br>" + text
    } else {
      description.innerHTML =
        "Please open a Google Meet page to automatically start the Timer!"
    }
  })
}

function updateTime(remainingDurationInS) {
  hours = Math.floor(remainingDurationInS / 3600)
  minutes = Math.floor((remainingDurationInS / 60) % 60)
  seconds = Math.floor(remainingDurationInS % 60)
  return [hours, minutes, seconds]
}

function createAlarm(name, periodInMinutes) {
  // `chrome.alarms.create` creates an alarm every second
  chrome.alarms.create(name, { periodInMinutes })
}

function clearAlarm(name) {
  chrome.alarms.clear(name)
}

function displayBadgeText(text) {
  chrome.action.setBadgeText({ text })
}

function saveToLocalStorage(obj) {
  chrome.storage.local.set(obj)
}
