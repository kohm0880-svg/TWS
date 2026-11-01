'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {normalizeLanguage,validateWord}=require('../wordRules');
const dictionary=new Set(['hello','world','i','preserve','preserved','apple']);

test('English remains the default and Korean is opt-in',()=>{
assert.equal(normalizeLanguage('ko'),'ko');
assert.equal(normalizeLanguage('random'),'en');
});

test('English dictionary and punctuation rules are preserved',()=>{
assert.deepEqual(validateWord('Hello!','en',dictionary),{text:'Hello!',key:'hello'});
assert.equal(validateWord('hello,','en',dictionary).key,'hello');
assert.notEqual(validateWord('preserve','en',dictionary).key,validateWord('preserved','en',dictionary).key);
assert.throws(()=>validateWord('Qwerty','en',dictionary),/dictionary/);
});

test('Korean validates eojeol format and supports suffixes',()=>{
assert.deepEqual(validateWord('학교에서,','ko',dictionary),{text:'학교에서,',key:'학교에서'});
assert.equal(validateWord('먹었는데','ko',dictionary).key,'먹었는데');
assert.equal(validateWord('고양이!','ko',dictionary).key,validateWord('고양이','ko',dictionary).key);
assert.notEqual(validateWord('학교에서','ko',dictionary).key,validateWord('학교에','ko',dictionary).key);
});

test('Korean supports numbers and acronyms but rejects multi-eojeol',()=>{
for(const w of ['2026년','GPT가','AI','123','UFC는'])assert.equal(validateWord(w,'ko',dictionary).text,w);
for(const w of ['hello','John','ㄱㄴ','나는 학교에'])assert.throws(()=>validateWord(w,'ko',dictionary));
});

test('NFC and maximum length work in Korean',()=>{
assert.equal(validateWord('가\u1102\u1161','ko',dictionary).key,'가나');
assert.throws(()=>validateWord('가'.repeat(41),'ko',dictionary),/너무/);
});

test('browser inline script parses',()=>{
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/i);
assert.ok(match);
assert.doesNotThrow(()=>new Function(match[1]));
});

test('room mode is sent and synchronized',()=>{
const source=fs.readFileSync(path.join(__dirname,'../server.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
assert.match(source,/lang:normalizeLanguage\(m\.lang\)/);
assert.match(source,/lang:r\.lang/);
assert.match(source,/validateWord\(m\.word,r\.lang,dictionary\)/);
assert.match(html,/lang:\$\('language'\)\.value/);
assert.match(html,/oncompositionend/);
});
