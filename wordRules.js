'use strict';

const ENGLISH_TOKEN = /^([a-z]+(?:['-][a-z]+)*)([,.!?]?)$/i;
const KOREAN_TOKEN = /^([\uAC00-\uD7A3A-Za-z0-9]+)([,.!?]?)$/u;
const KOREAN_EOJEOL = /^(?:[\uAC00-\uD7A30-9]+|[A-Z]{2,}[\uAC00-\uD7A30-9]*)$/u;
const MAX_TOKEN_LENGTH = 40;

// Numeric expressions and registered acronyms require a small supplementary
// rule set: spellcheck dictionaries do not always include arbitrary numerals.
const COUNTERS = [
  '킬로미터','킬로그램','밀리미터','센티미터','킬로','미터','그램','리터',
  '개월','시간','마리','번째','퍼센트','달러','만원','천원',
  '개','명','분','초','시','년','월','일','원','번','회','차',
  '살','권','장','병','층','점','배','대','쪽'
].sort((a,b)=>b.length-a.length);
const SIMPLE_PARTICLES = new Set([
  '은','는','이','가','을','를','에','에서','으로','로','의',
  '와','과','도','만','까지','부터','처럼','보다','쯤','마다',
  '조차','마저','밖에','랑','이랑','이나','나','이라도','라도',
  '에게','께','께서','에게서','한테','한테서','로서','로써',
  '에서만','에서도','에서는','에게도','에게는','에도','에는',
  '으로도','로도','까지는','부터는','만큼','하고'
]);
const ALLOWED_ACRONYMS = new Set([
  'AI','GPT','UFC','MMA','SNS','USB','TV','PC','CPU','CEO','NASA','KTX',
  'BTS','KPOP','HTML','CSS','JS','API','IT','B2B'
]);

function normalizeLanguage(lang) {
  return lang === 'ko' ? 'ko' : 'en';
}

function isKnownNumberOrAcronym(word) {
  let rest = null;
  if (/^\d+$/u.test(word)) return true;
  const num = /^(\d{1,12})([\uAC00-\uD7A3]+)$/u.exec(word);
  if (num) rest = num[2];
  else {
    const match = /^([A-Z][A-Z0-9]+)([\uAC00-\uD7A3]*)$/u.exec(word);
    if (!match || !ALLOWED_ACRONYMS.has(match[1])) return false;
    rest = match[2];
  }
  if (rest === '') return true;
  if (SIMPLE_PARTICLES.has(rest)) return true;
  for (const counter of COUNTERS) {
    if (rest === counter) return true;
    if (rest.startsWith(counter) && SIMPLE_PARTICLES.has(rest.slice(counter.length))) return true;
  }
  return false;
}

function validateWord(raw, lang, englishDictionary, koreanChecker) {
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
      throw new Error('한국어 어절, 숫자 또는 등록된 영어 약어를 입력해 주세요.');
    }
    if (!koreanChecker || typeof koreanChecker.correct !== 'function') {
      throw new Error('한국어 사전 검사기가 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    }
    if (!isKnownNumberOrAcronym(word) && !koreanChecker.correct(word)) {
      throw new Error('사전에서 확인되지 않는 어절입니다. 다른 표현을 사용해 주세요.');
    }
  } else if (!englishDictionary?.has(word.toLowerCase())) {
    throw new Error('Not in dictionary');
  }
  return { text, key: mode === 'en' ? word.toLowerCase() : word };
}

module.exports = { normalizeLanguage, validateWord, isKnownNumberOrAcronym };
