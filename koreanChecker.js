'use strict';

// dictionary-ko and nspell are ESM dependencies, loaded in the CommonJS server
// using import(). The server never sends story text to a third-party service.
async function loadKoreanChecker(importModule = (name) => import(name)) {
  const [dictionaryModule, nspellModule] = await Promise.all([
    importModule('dictionary-ko'), importModule('nspell')
  ]);
  const dict = dictionaryModule.default;
  const createNspell = nspellModule.default;
  if (!dict || !dict.aff || !dict.dic || typeof createNspell !== 'function') {
    throw new Error('Korean dictionary modules have an unexpected format.');
  }
  const engine = createNspell(dict);
  if (typeof engine?.correct !== 'function') {
    throw new Error('Korean checker failed to initialize.');
  }
  return { correct: (word) => engine.correct(word) };
}

module.exports = { loadKoreanChecker };
