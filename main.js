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

// --- Samples dropdown ---

let samples = document.querySelectorAll("sample-element");
let activeSample = null;
let isReversed = false;
let currentSpeed = 1;
let menuOpen = false;

const samplesTrigger = document.getElementById("samplesTrigger");
const samplesLabel = document.getElementById("samplesLabel");
const samplesArrow = document.getElementById("samplesArrow");
const samplesMenu = document.getElementById("samplesMenu");
const sampleProgressBar = document.getElementById("sampleProgressBar");
const btnReverse = document.getElementById("transportReverse");
const btnPlayPause = document.getElementById("transportPlayPause");
const sliderSpeed = document.getElementById("transportSpeed");
const speedLabel = document.getElementById("speedLabel");

// Build menu items
const menuItems = [];
samples.forEach((element) => {
  const item = document.createElement("div");
  item.className = "sample-item";

  const name = document.createElement("span");
  name.textContent = element.getSampleName();

  const key = document.createElement("span");
  key.className = "sample-item-key";
  key.textContent = element.activationKey;

  item.appendChild(name);
  item.appendChild(key);
  samplesMenu.appendChild(item);

  item.addEventListener("click", () => {
    switchToSample(element);
  });

  menuItems.push({ item, element });
});

// Toggle dropdown
samplesTrigger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  samplesMenu.classList.toggle("open", menuOpen);
  samplesTrigger.classList.toggle("open", menuOpen);
  samplesArrow.innerHTML = menuOpen ? "&#9652;" : "&#9662;";
});

// Close dropdown on outside click
document.addEventListener("click", (evt) => {
  if (menuOpen && !evt.target.closest(".samples-dropdown-wrapper")) {
    menuOpen = false;
    samplesMenu.classList.remove("open");
    samplesTrigger.classList.remove("open");
    samplesArrow.innerHTML = "&#9662;";
  }
});

// Sample activation
samples.forEach((element) => {
  document.addEventListener("keydown", (evt) => {
    if (evt.key === element.getAttribute("activation-key")) {
      switchToSample(element);
    }
  });
});

function switchToSample(element) {
  samples.forEach((sample) => {
    if (sample !== element) sample.stop();
  });
  activeSample = element;
  element.play({ reverse: isReversed, speed: currentSpeed });
  btnPlayPause.textContent = "⏸";
  samplesLabel.textContent = element.getSampleName();

  // Highlight active item
  menuItems.forEach((mi) => {
    mi.item.classList.toggle("active", mi.element === element);
  });
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
  currentSpeed = Math.min(3, Math.max(0.1, Math.round(speed * 10) / 10));
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
  } else if (evt.key === "ArrowLeft") {
    evt.preventDefault();
    setSpeed(currentSpeed - 0.1);
  } else if (evt.key === "ArrowRight") {
    evt.preventDefault();
    setSpeed(currentSpeed + 0.1);
  }
});

// Progress bar animation — single bar under the select
function updateProgressBar() {
  if (activeSample) {
    sampleProgressBar.style.width = (activeSample.getProgress() * 100) + "%";
  } else {
    sampleProgressBar.style.width = "0%";
  }
  requestAnimationFrame(updateProgressBar);
}
requestAnimationFrame(updateProgressBar);
