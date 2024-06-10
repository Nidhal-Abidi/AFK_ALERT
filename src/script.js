const startBtn = document.querySelector("#start-timer")
const resetBtn = document.querySelector("#reset-timer")
const description = document.querySelector("#description")
const timerContainer = document.querySelector("#timer-container")

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
      startBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
    })
  })
})

resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({ isRunning: false, remainingTime: 3600 }, () => {
    startBtn.textContent = "Start Timer"
  })
  chrome.action.setBadgeText({ text: "" })
})

updatePopup()
setInterval(updatePopup, 1000)

function updatePopup() {
  updateTimerContainer()
  updateTextDescription()
}

function updateTimerContainer() {
  chrome.storage.local.get(["remainingTime", "isGoogleMeetLink"], (res) => {
    let remainingTime = res["remainingTime"]
    const [hours, minutes, seconds] = updateTime(remainingTime)
    timerContainer.innerHTML = hours + "h " + minutes + "m " + seconds + "s"
  })
}

function updateTextDescription() {
  chrome.storage.local.get(["isGoogleMeetLink", "automaticTimerIn"], (res) => {
    if (res["isGoogleMeetLink"]) {
      let text =
        res["automaticTimerIn"] != undefined
          ? `Timer starts automatically in ${res["automaticTimerIn"]}`
          : ""

      description.innerHTML = "I hope you have a productive meeting!!\n" + text
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
