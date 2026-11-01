# Three Word Story (TWS)

Online multiplayer, collaborative English word story. Players take turns adding three words, one word at a time. Each accepted word becomes visible to everyone when the player presses **Space** or **Enter**.

## Rules

- 2–6 players per room; invite friends using a six-character room code. Only the crowned host can start a round; other players see a waiting screen.
- Three words per turn. All past words appear in one running story. Player colors are vivid and consistent; your own words have an additional white outline. The active player's new words are underlined.
- Fischer clock: **20+5 default** (20 seconds initially; +5 seconds only after all three words in a turn). Other presets are available when creating a room.
- All words must appear in the English dictionary, including capitalized words (no proper-name bypass). Each player may use an exact spelling only once; different players can reuse the same spelling. Capitalization and trailing punctuation do not change word identity. `preserve`, `preserves`, `preserved`, and `preserving` are distinct.
- Running out of personal time eliminates the player. Last surviving player wins.

## Run

Requires Node.js 20+. Run `npm install` then `npm start`, and open http://localhost:3000. To test multiplayer, open two browser tabs and enter the same room code using different nicknames.

## Deploy to Render

This repository includes `render.yaml`. Connect **kohm0880-svg/TWS** as a **Web Service**, with build command `npm install` and start command `npm start`. A static site is insufficient because room state and clocks run on the WebSocket server.

## Notes

- All rooms are stored in server memory and reset on redeployment/restart.
- This GitHub version was reconstructed for connector-based upload and uses the `wordlist-english` SCOWL-derived dictionary package, rather than the bundled CMU-derived word list in the earlier local ZIP. Some accepted words may differ.
- The UI and server have not been verified through a live multi-device deployment. Perform a three-player smoke test after deploying.
