# Three Word Story (TWS)

Online multiplayer, collaborative English and Korean word story. Players take turns adding three words, one word at a time. Each accepted word becomes visible to everyone when the player presses **Space** or **Enter**.

## Rules

- 2–6 players per room; invite friends using a six-character room code. Only the crowned host can start a round; other players see a waiting screen.
- The host selects **English** or **한국어 (beta)** when creating a room; everyone in that room uses the same language, including in rematches. English: 3 dictionary words per turn. Korean: 3 space-delimited **eojeol** (어절) per turn. Korean beta validates Hangul syllable format (and numbers/uppercase acronyms) but does **not** verify Korean dictionary membership.
- Three words / eojeol per turn. All past words appear in one running story. Player colors are vivid and consistent; your own words have an additional white outline. The active player's new words are underlined.
- Fischer clock: **20+5 default** (20 seconds initially; +5 seconds only after all three words in a turn). Other presets are available when creating a room.
- English words must appear in the English dictionary, including capitalized words (no proper-name bypass). Korean test mode allows Hangul-composed eojeol and does not claim to enforce dictionary membership. Each player may use an exact spelling only once; different players can reuse the same spelling. Capitalization and trailing punctuation do not change word identity. `preserve`, `preserves`, `preserved`, and `preserving` are distinct.
- Running out of personal time eliminates the player. Last surviving player wins.

## Run

Requires Node.js 20+. Run `npm install` then `npm start`, and open http://localhost:3000. To test multiplayer, open two browser tabs and enter the same room code using different nicknames.

## Deploy to Render

This repository includes `render.yaml`. Connect **kohm0880-svg/TWS** as a **Web Service**, with build command `npm install` and start command `npm start`. A static site is insufficient because room state and clocks run on the WebSocket server.

## Notes

- All rooms are stored in server memory and reset on redeployment/restart.
- This GitHub version was reconstructed for connector-based upload and uses the `wordlist-english` SCOWL-derived dictionary package, rather than the bundled CMU-derived word list in the earlier local ZIP. Some accepted words may differ.
- The UI and server have not been verified through a live multi-device deployment. Perform a three-player smoke test after deploying.

## Korean input and IME

- The space key finalizes **one eojeol**, not a Korean morpheme. For example: `나는 / 어제 / 학교에서` counts as three entries.
- Korean input works with IME composition events; text remains private until committed by Space or Enter.
- Punctuation `, . ? !` attaches to the current eojeol and does not count separately. Exact duplicates are checked for each player after stripping trailing punctuation; `학교에서` and `학교에서,` are duplicates, but `학교에서` and `학교에` are not.
- The Korean mode intentionally uses script/form validation instead of rejecting valid Korean conjugations and particles against a headword-only dictionary. It may accept nonsense Hangul strings during beta.
