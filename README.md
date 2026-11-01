# Three Word Story (TWS)

Online multiplayer, collaborative English and Korean word story. Korean beta now supports dictionary-based spelling and inflection checks. Players take turns adding three words, one word at a time. Each accepted word becomes visible to everyone when the player presses **Space** or **Enter**.

## Rules

- 2–6 players per room; invite friends using a six-character room code. Only the crowned host can start a round; other players see a waiting screen.
- The host selects **English** or **한국어 (beta)** when creating a room; everyone in that room uses the same language, including in rematches. English: 3 dictionary words per turn. Korean: 3 space-delimited **eojeol** (어절) per turn. Korean beta uses the **Hunspell-ko** spelling dictionary through `dictionary-ko` and the JavaScript `nspell` engine to check inflected words and attached particles; numeral+counter forms and selected common acronyms use additional bounded rules. It is still not a full sentence grammar checker.
- Three words / eojeol per turn. All past words appear in one running story. Player colors are vivid and consistent; your own words have an additional white outline. The active player's new words are underlined.
- Fischer clock: **20+5 default** (20 seconds initially; +5 seconds only after all three words in a turn). Other presets are available when creating a room.
- English words must appear in the English dictionary, including capitalized words (no proper-name bypass). Korean mode requires the spell checker to recognize Hangul eojeol (except for the documented numeral/counter and known-acronym exceptions); it may reject valid proper names, new words, dialect and rare constructions. Each player may use an exact spelling only once; different players can reuse the same spelling. Capitalization and trailing punctuation do not change word identity. `preserve`, `preserves`, `preserved`, and `preserving` are distinct.
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
- Korean mode now uses Korean Hunspell affix rules and dictionary entries (instead of script-only validation). Nonsense Hangul is ordinarily rejected. The game still does not validate the complete sentence's grammar or meaning.
- If the Korean checker is still initializing, creating a Korean room displays a retry message. If it fails, English rooms remain available, and the `/health` endpoint identifies the Korean checker as `error`.
- Run `npm test` for mock-based unit tests and `npm run test:ko` after installing dependencies to sample the real dictionary's acceptance rates.
- Third-party data: `dictionary-ko` packages `spellcheck-ko/hunspell-dict-ko` with separate dictionary licenses (GPL-2.0 OR LGPL-2.1 OR MPL-1.1); `nspell` is MIT-licensed. Review these licenses before redistribution.
