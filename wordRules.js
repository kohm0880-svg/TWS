'use strict';

const ENGLISH_TOKEN = /^([a-z]+(?:['-][a-z]+)*)([,.!?]?)$/i;
const KOREAN_TOKEN = /^([\uAC00-\uD7A3A-Za-z0-9]+)([,.!?]?)$/u;
const KOREAN_EOJEOL = /^(?:[\uAC00-\uD7A30-9]+|[A-Z]{2,}[\uAC00-\uD7A30-9]*)$/u;
const MAX_TOKEN_LENGTH = 40;

function normalizeLanguage(lang) {
  return lang === 'ko' ? 'ko' : 'en';
}

function validateWord(raw, lang, englishDictionary) {
  const mode = normalizeLanguage(lang);
  const text = String(raw ?? '').normalize('NFC').trim();
  if ([...text].length > MAX_TOKEN_LENGTH) {
    throw new Error(mode === 'ko' ? '어절이 너무 깁니다.' : 'Word is too long');
  }
  const match = (mode === 'ko' ? KOREAN_TOKEN : ENGLISH_TOKEN).exec(text);
  if (!match) {
    throw new Error(mode === 'ko' ? '한 번에 한 어절을 입력해 주세요.' : 'Enter one English word');
  }
  const word = match[1];
  if (mode === 'ko') {
    if (!KOREAN_EOJEOL.test(word)) {
      throw new Error('한국어 어절, 숫자 또는 영어 약어를 입력해 주세요.');
    }
  } else if (!englishDictionary?.has(word.toLowerCase())) {
    throw new Error('Not in dictionary');
  }
  return { text, key: mode === 'en' ? word.toLowerCase() : word };
}

module.exports = { normalizeLanguage, validateWord };
