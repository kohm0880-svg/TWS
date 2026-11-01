'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {normalizeLanguage,validateWord,isKnownNumberOrAcronym}=require('../wordRules');
const {loadKoreanChecker}=require('../koreanChecker');
const words=new Set(['school','apple','preserve','preserved']);
const spellAccepted=new Set(['학교','학교에서','사람','사람에게도','먹었는데','갔어요','했어요','사과','먹었다','나는','오늘']);
const spell={correct:w=>spellAccepted.has(w)};

test('Korean mode selection and English mode intact',()=>{
assert.equal(normalizeLanguage('ko'),'ko');assert.equal(normalizeLanguage('other'),'en');
assert.equal(validateWord('Apple','en',words).key,'apple');
assert.throws(()=>validateWord('Qwerty','en',words),/dictionary/);
});
test('Korean dictionary recognizes supplied nouns, particles and verb forms',()=>{
for(const w of ['학교에서','사람에게도','먹었는데','갔어요','했어요'])
 assert.equal(validateWord(w,'ko',words,spell).key,w);
});
test('Korean unknown valid-script words rejected by dictionary checker',()=>{
for(const w of ['헵듕뜌쫍','가나다하호호'])assert.throws(()=>validateWord(w,'ko',words,spell),/사전/);
});
test('punctuation excluded from identity, inflection does not collapse',()=>{
assert.equal(validateWord('학교에서,','ko',words,spell).key,'학교에서');
assert.notEqual(validateWord('학교','ko',words,spell).key,validateWord('학교에서','ko',words,spell).key);
assert.notEqual(validateWord('preserve','en',words).key,validateWord('preserved','en',words).key);
});
test('numeral/counter and registered acronym exceptions are narrow',()=>{
for(const w of ['2026년','3명이','10분','GPT가','AI는','UFC에서'])
 assert.equal(validateWord(w,'ko',words,spell).text,w);
for(const w of ['2026헵듕','ZZZZ가','7무작위'])assert.throws(()=>validateWord(w,'ko',words,spell));
assert.equal(isKnownNumberOrAcronym('2026년'),true);
assert.equal(isKnownNumberOrAcronym('2026헵듕'),false);
});
test('one eojeol, combined Hangul and punctuation rules',()=>{
for(const w of ['학교 에서','ㄱㄴ','hello','학교!!'])assert.throws(()=>validateWord(w,'ko',words,spell));
assert.throws(()=>validateWord('가'.repeat(41),'ko',words,spell),/너무/);
});
test('Korean dictionary is required, not silently bypassed',()=>{
assert.throws(()=>validateWord('학교에서','ko',words,null),/준비/);
});
test('checker loader uses the correct ESM interface',async()=>{
const checker=await loadKoreanChecker(async(name)=>name==='dictionary-ko'
 ?{default:{aff:Buffer.from('x'),dic:Buffer.from('y')}}
 :{default:()=>({correct:w=>w==='학교'})});
assert.equal(checker.correct('학교'),true);assert.equal(checker.correct('헵듕'),false);
});
test('client inline script parses',()=>{
const fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const inline=h.match(/<script>([\s\S]*?)<\/script>/i);
assert.ok(inline);assert.doesNotThrow(()=>new Function(inline[1]));
});
