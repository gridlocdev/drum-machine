class Sample extends HTMLElement {
  activationKey = this.getAttribute("activation-key");
  audioSource = this.getAttribute("audio-source");
  volume = 0.5;
  currentSource = null;
  audioBuffer = null;
  reversedBuffer = null;
  isPaused = false;
  pauseOffset = 0;
  startTime = 0;
  _playbackRate = 1;
  _isReversed = false;

  constructor() {
    super().attachShadow({ mode: "open" }).innerHTML = /*html*/ `
      <button id="button">
        <span>
          ${this.activationKey}
        </span>
      </button>

      <style>
        button {
          background-color: #008c73;
          color: white;
          text-transform: capitalize;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 1.25em;
          font-weight: bold;
          border: none;
          padding: auto;
          width: 100%;
          aspect-ratio: 1;
          transition: 0.3s;
        }
        button:hover, button:active, button.playingAudio  {
          background-color: #00c09d;
        }
        </style>
      `;

    this.button = this.shadowRoot.getElementById("button");
    this.setAttribute("is-playing", false);
  }

  connectedCallback() {
    const { context, loadAudioBuffer, reverseAudioBuffer } = window.drumMachineAudio;
    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.volume;
    this.gainNode.connect(window.drumMachineAudio.masterGain);

    loadAudioBuffer(this.audioSource).then((buffer) => {
      this.audioBuffer = buffer;
      this.reversedBuffer = reverseAudioBuffer(buffer);
    });
  }

  play({ reverse = false, speed = 1 } = {}) {
    if (!this.audioBuffer) return;

    this.fullStop();

    this._isReversed = reverse;
    this._playbackRate = speed;
    this.isPaused = false;
    this.pauseOffset = 0;

    this._startSource(0);
  }

  _startSource(offset) {
    const { context } = window.drumMachineAudio;
    const source = context.createBufferSource();
    source.buffer = this._isReversed ? this.reversedBuffer : this.audioBuffer;
    source.loop = true;
    source.playbackRate.value = this._playbackRate;
    source.connect(this.gainNode);

    source.onended = () => {
      if (this.currentSource === source) {
        this.currentSource = null;
      }
    };

    this.currentSource = source;
    this.startTime = context.currentTime - (offset / this._playbackRate);
    this.setAttribute("is-playing", true);
    this.button.classList.add("playingAudio");
    source.start(0, offset);
  }

  _getCurrentOffset() {
    if (!this.audioBuffer) return 0;
    const { context } = window.drumMachineAudio;
    const duration = this.audioBuffer.duration;
    const elapsed = (context.currentTime - this.startTime) * this._playbackRate;
    return ((elapsed % duration) + duration) % duration;
  }

  pause() {
    if (!this.currentSource || this.isPaused) return;

    this.pauseOffset = this._getCurrentOffset();
    this.currentSource.onended = null;
    this.currentSource.stop();
    this.currentSource = null;
    this.isPaused = true;
    // Keep is-playing and CSS highlight — still the "active" sample
  }

  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this._startSource(this.pauseOffset);
  }

  setSpeed(speed) {
    this._playbackRate = speed;
    if (this.currentSource && !this.isPaused) {
      // Recalculate startTime so offset math stays correct
      const offset = this._getCurrentOffset();
      this.currentSource.playbackRate.value = speed;
      const { context } = window.drumMachineAudio;
      this.startTime = context.currentTime - (offset / speed);
    }
    // If paused, the stored pauseOffset remains valid; new rate applies on resume
  }

  setReverse(reverse) {
    if (this._isReversed === reverse) return;

    const duration = this.audioBuffer ? this.audioBuffer.duration : 0;

    if (this.isPaused) {
      this.pauseOffset = duration - this.pauseOffset;
      this._isReversed = reverse;
    } else if (this.currentSource) {
      const offset = this._getCurrentOffset();
      const mirroredOffset = duration - offset;
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource = null;
      this._isReversed = reverse;
      this._startSource(mirroredOffset);
    } else {
      this._isReversed = reverse;
    }
  }

  getProgress() {
    if (!this.audioBuffer) return 0;
    let raw;
    if (this.isPaused) {
      raw = this.pauseOffset / this.audioBuffer.duration;
    } else if (!this.currentSource) {
      return 0;
    } else {
      raw = this._getCurrentOffset() / this.audioBuffer.duration;
    }
    return this._isReversed ? 1 - raw : raw;
  }

  getSampleName() {
    const path = this.audioSource || "";
    const filename = path.split("/").pop() || "";
    return filename.replace(/\.\w+$/, "");
  }

  stop() {
    this.fullStop();
  }

  fullStop() {
    if (this.currentSource) {
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.isPaused = false;
    this.pauseOffset = 0;
    this.setAttribute("is-playing", false);
    this.button.classList.remove("playingAudio");
  }
}

customElements.define("sample-element", Sample);
