window.drumMachineAudio = (() => {
  const context = new AudioContext();

  // Resume context on first user interaction (autoplay policy)
  const resume = () => {
    if (context.state === "suspended") {
      context.resume();
    }
  };
  document.addEventListener("click", resume, { once: true });
  document.addEventListener("keydown", resume, { once: true });

  const bufferCache = new Map();

  async function loadAudioBuffer(url) {
    if (bufferCache.has(url)) {
      return bufferCache.get(url);
    }
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    bufferCache.set(url, audioBuffer);
    return audioBuffer;
  }

  return { context, loadAudioBuffer };
})();
