function pad(num) {
  return String(num).padStart(2, '0');
}

// Stopwatch logic
let startTime = 0;
let elapsedTime = 0;
let interval = null;
let isRunning = false;
const timerDisplay = document.getElementById("timer");
const lapsContainer = document.getElementById("laps");
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');

function getTimeParts(ms) {
  let min = Math.floor(ms / 60000);
  let sec = Math.floor((ms % 60000) / 1000);
  let cs = Math.floor((ms % 1000) / 10);
  return [pad(min), pad(sec), pad(cs)];
}

function updateStopwatchDisplay(ms) {
  const [min, sec, cs] = getTimeParts(ms);
  timerDisplay.textContent = `${min}:${sec}:${cs}`;
}

function startStopwatch() {
  startTime = Date.now() - elapsedTime;
  interval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateStopwatchDisplay(elapsedTime);
  }, 10);
  isRunning = true;
  startStopBtn.textContent = 'Pause';
}

function stopStopwatch() {
  clearInterval(interval);
  isRunning = false;
  startStopBtn.textContent = 'Start';
}

function resetStopwatch() {
  stopStopwatch();
  elapsedTime = 0;
  updateStopwatchDisplay(0);
  lapsContainer.innerHTML = '';
}

function lapStopwatch() {
  if (!isRunning) return;
  const [min, sec, cs] = getTimeParts(elapsedTime);
  const li = document.createElement('li');
  li.textContent = `${min}:${sec}:${cs}`;
  lapsContainer.appendChild(li);
}

startStopBtn.addEventListener('click', () => {
  if (isRunning) {
    stopStopwatch();
  } else {
    startStopwatch();
  }
});

resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', lapStopwatch);

// Initialize display to 00:00:00
updateStopwatchDisplay(0);
