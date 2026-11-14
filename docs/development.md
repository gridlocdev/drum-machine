# Development

Drum Machine is plain HTML, CSS and JavaScript with two Web Components and the Web Audio API. There's no package manager, no bundler and no build step: the files in the repository are the site.

## Getting set up

You need a static web server, such as Python 3's:

```bash
python3 -m http.server 8000   # serve the repository at http://localhost:8000
```

It must be served over HTTP, not opened as a file, because the sounds load with `fetch`. Reload the page to see a change.

## Checking your work

There are no automated checks or tests. After a change, open the page and try the drum keys, a sample loop, pause, reverse, the speed and volume sliders, and the **Help** dialog. The code is formatted with [Prettier](https://prettier.io) using `.prettierrc.json` (2-space indent, double quotes, 140 columns):

```bash
npx prettier --check .   # report files that aren't formatted
```

## Layout

```
index.html            the page: the drum pads, the hidden sample elements, the toolbar and the Keyboard Shortcuts dialog
style.css             all the styles
audio-context.js      window.drumMachineAudio: the AudioContext, a master gain, a buffer cache and buffer reversing
components/drum.js    <drum-element>: a pad that plays its sound once on its key or a click
components/sample.js  <sample-element>: a looping sample with pause, resume, speed and reverse
main.js               wires up the keys, the sample menu, the transport, volume, the progress bar and the dialog
assets/drums/         the nine drum sounds (MP3)
assets/samples/       the nine sample loops (MP3)
Dockerfile            serves the site with BusyBox httpd on port 8080
```

Every sound is decoded once into an `AudioBuffer` and played through its element's gain node (0.5) into the master gain, which the **Volume** slider sets. A sample's reversed buffer is made once when it loads.

### Adding a drum

1. Put the sound in `assets/drums/`.
2. Add a `<drum-element activation-key="<key>" audio-source="./assets/drums/<file>">` to the grid in `index.html`. The pad shows its key as its label.
3. Add the key and the sound's name to the **Drums** list in the Keyboard Shortcuts dialog in `index.html`.
4. Check that the key isn't already used in `main.js` (`r`, `?`, `Space` and the arrows are).

### Adding a sample

1. Put the loop in `assets/samples/`. Its file name, without the extension, is the name shown in the sample menu.
2. Add a `<sample-element activation-key="<key>" audio-source="./assets/samples/<file>">` to the hidden `<div>` in `index.html`.
3. Update the **Samples** line in the Keyboard Shortcuts dialog if the keys change.

## Deploying

Copy `index.html`, `style.css`, `main.js`, `audio-context.js`, `components/` and `assets/` to any static web server, or build the Docker image:

```bash
docker build -t drum-machine .
docker run -p 8080:8080 drum-machine   # then open http://localhost:8080
```

