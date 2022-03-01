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

let sampleShouldLoop = true;
document.getElementById("samplesLoopCheckbox").checked = sampleShouldLoop;
document.addEventListener("keydown", (evt) => {
  if (evt.key === "0") {
    toggleSampleLooping();
  }
});
document.getElementById("samplesLoopCheckbox").addEventListener("click", (evt) => {
  toggleSampleLooping();
});

function toggleSampleLooping() {
  sampleShouldLoop = !sampleShouldLoop;
  document.getElementById("samplesLoopCheckbox").checked = sampleShouldLoop;
  samples.forEach((sample) => {
    sample.setAttribute("should-loop", sampleShouldLoop);
  });
}

function switchToSample(element) {
  samples.forEach((sample) => {
    if (sample.getAttribute("is-playing") === "true") {
      sample.stop();
    }
  });
  element.play();
}
