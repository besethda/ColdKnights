# Cold Knights

Cold Knights is a small browser platform game. Guide the knight across the floating platforms and reach the campfire before the cold timer runs out.

## Run Locally

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Open a terminal in the project folder.
3. Start a local Node.js server:

   ```bash
   npx http-server -p 8000
   ```

4. Open [http://localhost:8000](http://localhost:8000) in a browser.
5. Click **Start** to begin.

## Controls

| Key         | Action     |
| ----------- | ---------- |
| Left Arrow  | Move left  |
| Right Arrow | Move right |
| Space       | Jump       |

## Objective

- Reach the campfire to win.
- Avoid falling from the platforms.
- Finish within 30 seconds, before the cold meter runs out.

## Project Structure

```text
index.html                    Main game page
public/images/                Game artwork and sprites
scripts/game.js               Game logic and controls
scripts/jquery-3.7.1.min.js   jQuery dependency
styles/styles.css             Layout and visual styles
```

## Technologies

- HTML
- CSS
- JavaScript
- jQuery
