class Sample extends HTMLElement {
  static get observedAttributes() {
    return ["should-loop"];
  }

  activationKey = this.getAttribute("activation-key");
  audioSource = this.getAttribute("audio-source");
  volume = 0.5;
  currentSource = null;

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
    this.setAttribute("should-loop", true);
  }

  connectedCallback() {
    const { context, loadAudioBuffer } = window.drumMachineAudio;
    this.gainNode = context.createGain();
    this.gainNode.gain.value = this.volume;
    this.gainNode.connect(context.destination);

    loadAudioBuffer(this.audioSource).then((buffer) => {
      this.audioBuffer = buffer;
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "should-loop" && this.currentSource) {
      this.currentSource.loop = newValue === "true";
    }
  }

  onclick() {
    this.play();
  }
  play() {
    if (!this.audioBuffer) return;

    // Stop any currently playing source
    if (this.currentSource) {
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource = null;
    }

    const { context } = window.drumMachineAudio;
    const source = context.createBufferSource();
    source.buffer = this.audioBuffer;
    source.loop = this.getAttribute("should-loop") === "true";
    source.connect(this.gainNode);

    source.onended = () => {
      this.currentSource = null;
      this.setAttribute("is-playing", false);
      this.button.classList.remove("playingAudio");
    };

    this.currentSource = source;
    this.setAttribute("is-playing", true);
    this.button.classList.add("playingAudio");
    source.start(0);
  }
  stop() {
    if (this.currentSource) {
      this.currentSource.onended = null;
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.setAttribute("is-playing", false);
    this.button.classList.remove("playingAudio");
  }
}

customElements.define("sample-element", Sample);
