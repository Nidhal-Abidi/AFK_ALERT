const startBtn = document.querySelector("#start-timer")
const resetBtn = document.querySelector("#reset-timer")
const description = document.querySelector("#description")
const timerContainer = document.querySelector("#timer-container")

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
      }
    )
  })
})

resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({ isRunning: false, timer: 3600 }, () => {
    startBtn.textContent = "Start Timer"
  })
})

updateTimerContainer()
setInterval(updateTimerContainer, 1000)

function updateTimerContainer() {
  chrome.storage.local.get(["timer", "isGoogleMeetLink"], (res) => {
    let remainingTime = res["timer"]
    const [hours, minutes, seconds] = updateTime(remainingTime)
    timerContainer.innerHTML = hours + "h " + minutes + "m " + seconds + "s"

    if (res["isGoogleMeetLink"]) {
      description.innerHTML = "I hope you have a productive meeting!!"
    }
  })
}

function updateTime(remainingDurationInS) {
  hours = Math.floor(remainingDurationInS / 3600)
  minutes = Math.floor((remainingDurationInS / 60) % 60)
  seconds = Math.floor(remainingDurationInS % 60)
  return [hours, minutes, seconds]
}
