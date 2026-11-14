# Getting started

You can play Drum Machine in a browser, serve it from source, or host it yourself with Docker.

## What you need

- A browser with Web Audio, and a keyboard to get the most out of it. On a touch screen you can tap the pads and the toolbar, but the key shortcuts and the **Help** button aren't there.
- Only for running from source: any static web server, such as Python 3's `http.server`.

## Play online

Open [gridloc.dev/apps/drum-machine](https://gridloc.dev/apps/drum-machine). Nothing needs installing.

## Run it from source

There's no build step and nothing to install. Serve the repository folder over HTTP and open it:

```bash
git clone https://github.com/gridlocdev/drum-machine.git
cd drum-machine
python3 -m http.server 8000   # then open http://localhost:8000
```

It must be served over HTTP, not opened as a file, because it loads its sounds with `fetch`.

## Run it with Docker

The `Dockerfile` copies the site into a BusyBox image and serves it with `httpd` on port 8080:

```bash
docker build -t drum-machine .
docker run -p 8080:8080 drum-machine
```

Then open http://localhost:8080.

The `Dockerfile` doesn't copy `audio-context.js` yet, so the page it serves doesn't work until `COPY audio-context.js ./` is added next to the other `COPY` lines.

## First run

Press a letter key, such as `Z` for the kick, to hear a drum. Then press `1` to start the first loop and play the drums over it. Press `?` or the **Help** button at any time to see every shortcut. Browsers start the sound only after your first click or key press. Nothing is saved between visits.
