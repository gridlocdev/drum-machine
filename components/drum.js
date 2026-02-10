class Drum extends HTMLElement {
  activationKey = this.getAttribute("activation-key");
  audioSource = this.getAttribute("audio-source");
  volume = 0.5;

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

  onclick() {
    this.play();
  }
  play() {
    if (!this.audioBuffer) return;

    const { context } = window.drumMachineAudio;
    const source = context.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.gainNode);

    this.button.classList.add("playingAudio");
    source.onended = () => {
      this.button.classList.remove("playingAudio");
    };

    source.start(0);
  }
}

customElements.define("drum-element", Drum);
