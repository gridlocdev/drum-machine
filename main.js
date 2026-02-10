let drums = document.querySelectorAll("drum-element");
drums.forEach((element) => {
  document.addEventListener("keydown", (evt) => {
    if (evt.key === element.getAttribute("activation-key")) {
      element.play();
    }
  });
  element.addEventListener("click", (evt) => {
    element.play();
  });
});

let samples = document.querySelectorAll("sample-element");
let activeSample = null;
let isReversed = false;
let currentSpeed = 1;

const btnReverse = document.getElementById("transportReverse");
const btnPlayPause = document.getElementById("transportPlayPause");
const sliderSpeed = document.getElementById("transportSpeed");
const speedLabel = document.getElementById("speedLabel");

samples.forEach((element) => {
  document.addEventListener("keydown", (evt) => {
    if (evt.key === element.getAttribute("activation-key")) {
      switchToSample(element);
    }
  });
  element.addEventListener("click", (evt) => {
    switchToSample(element);
  });
});

function switchToSample(element) {
  samples.forEach((sample) => {
    if (sample !== element) sample.stop();
  });
  activeSample = element;
  element.play({ reverse: isReversed, speed: currentSpeed });
  btnPlayPause.textContent = "⏸";
}

// Reverse
btnReverse.addEventListener("click", () => toggleReverse());
function toggleReverse() {
  isReversed = !isReversed;
  btnReverse.classList.toggle("active", isReversed);
  if (activeSample && activeSample.getAttribute("is-playing") === "true") {
    activeSample.setReverse(isReversed);
  }
}

// Play/Pause
btnPlayPause.addEventListener("click", () => togglePlayPause());
function togglePlayPause() {
  if (!activeSample) return;
  if (activeSample.isPaused) {
    activeSample.resume();
    btnPlayPause.textContent = "⏸";
  } else if (activeSample.getAttribute("is-playing") === "true") {
    activeSample.pause();
    btnPlayPause.textContent = "▶";
  }
}

// Speed
sliderSpeed.addEventListener("input", () => {
  setSpeed(parseFloat(sliderSpeed.value));
});

function setSpeed(speed) {
  currentSpeed = Math.round(speed * 10) / 10;
  sliderSpeed.value = currentSpeed;
  speedLabel.textContent = currentSpeed + "x";
  if (activeSample && activeSample.getAttribute("is-playing") === "true") {
    activeSample.setSpeed(currentSpeed);
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", (evt) => {
  if (evt.key === "r") {
    toggleReverse();
  } else if (evt.key === " ") {
    evt.preventDefault();
    togglePlayPause();
  } else if (evt.key === "f") {
    sliderSpeed.focus();
  }
});
