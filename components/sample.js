class Sample extends HTMLElement {
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
      
      <audio id="player">
        <source id="playerSource" src="${this.audioSource}">
      </audio>

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
          background-color: #00aa8c;
        }
        </style>
      `;

    this.player = this.shadowRoot.getElementById("player");
    this.button = this.shadowRoot.getElementById("button");
    this.player.volume = this.volume;
    this.setAttribute("is-playing", false);
    this.setAttribute("should-loop", true);
  }

  onclick() {
    this.play();
  }
  play() {
    this.setAttribute("is-playing", true);
    if (!this.button.classList.contains("playingAudio")) {
      this.button.classList.add("playingAudio");
    }
    this.player.load();
    this.player.play().catch((e) => {
      console.error(`Error caught: ${e}`);
    });
    this.player.onended = () => {
      this.setAttribute("is-playing", false);
      if (this.getAttribute("should-loop") === "true" && this.getAttribute("is-playing") === "false") {
        this.play();
      } else {
        this.stop();
      }
    };
  }
  stop() {
    this.player.pause();
    this.player.currentTime = 0;

    if (this.button.classList.contains("playingAudio")) {
      this.button.classList.remove("playingAudio");
    }
  }
}

customElements.define("sample-element", Sample);
