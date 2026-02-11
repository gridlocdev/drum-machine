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

  const reversedBufferCache = new Map();

  function reverseAudioBuffer(buffer) {
    if (reversedBufferCache.has(buffer)) {
      return reversedBufferCache.get(buffer);
    }
    const reversed = context.createBuffer(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const src = buffer.getChannelData(ch);
      const dst = reversed.getChannelData(ch);
      for (let i = 0; i < src.length; i++) {
        dst[i] = src[src.length - 1 - i];
      }
    }
    reversedBufferCache.set(buffer, reversed);
    return reversed;
  }

  const masterGain = context.createGain();
  masterGain.connect(context.destination);

  return { context, loadAudioBuffer, reverseAudioBuffer, masterGain };
})();
