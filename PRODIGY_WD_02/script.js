let timerDisplay = document.getElementById("timer");
let startStopBtn = document.getElementById("startStop");
let lapBtn = document.getElementById("lap");
let resetBtn = document.getElementById("reset");
let lapsContainer = document.getElementById("laps");

let startTime = 0;
let elapsedTime = 0;
let interval = null;
let isRunning = false;

function formatTime(ms) {
  let date = new Date(ms);
  let min = String(date.getUTCMinutes()).padStart(2, '0');
  let sec = String(date.getUTCSeconds()).padStart(2, '0');
  let msStr = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${min}:${sec}:${msStr}`;
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  interval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
  }, 10);
  isRunning = true;
  startStopBtn.textContent = "Pause";
}

function stopTimer() {
  clearInterval(interval);
  isRunning = false;
  startStopBtn.textContent = "Start";
}

startStopBtn.addEventListener("click", () => {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", () => {
  stopTimer();
  elapsedTime = 0;
  timerDisplay.textContent = "00:00:00";
  lapsContainer.innerHTML = "";
});

lapBtn.addEventListener("click", () => {
  if (!isRunning) return;
  const li = document.createElement("li");
  li.textContent = formatTime(elapsedTime);
  lapsContainer.appendChild(li);
});
