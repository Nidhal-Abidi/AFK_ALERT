// This file runs in the context of the webpage.
// It can change the style of a webpage, add more content...
// It runs in its own private environment, isolating it from the webpage & other extensions.(No overwriting)
// chrome APIs it can interact with directly are: runtime, storage, i18n.

function startTimer(durationInHours) {
  let remainingDurationInS = durationInHours * 60 * 60
  let hours = 0
  let minutes = 0
  let seconds = 0

  let intervalId = setInterval(() => {
    if (remainingDurationInS == 0) stopTimer(intervalId)
    displayTimer(hours, minutes, seconds)
    ;[hours, minutes, seconds] = updateTime(remainingDurationInS)
    remainingDurationInS -= 1
  }, 1000)
}

function stopTimer(intervalId) {
  clearInterval(intervalId)
}

function updateTime(remainingDurationInS) {
  hours = Math.floor(remainingDurationInS / 3600)
  minutes = Math.floor((remainingDurationInS / 60) % 60)
  seconds = Math.floor(remainingDurationInS % 60)
  return [hours, minutes, seconds]
}

function displayTimer(hours, minutes, seconds) {
  timerContainer.innerHTML = hours + "h " + minutes + "m " + seconds + "s"
}

/* chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = tabs[0].url
  console.log("Current URL=", url)
  startTimer(1)
}) */

;(() => {
  let currentMeeting = ""
  const timerContainer = document.querySelector("#timer-container")

  function newMeetingLoaded() {}

  console.log("timerContainer=", timerContainer)
  // Listen to messages coming from a service_worker (background.js)
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, meetingId } = obj

    console.log(meetingId)
    if (type === "NEW") {
      currentMeeting = meetingId
      newMeetingLoaded()
    }
  })
})()
