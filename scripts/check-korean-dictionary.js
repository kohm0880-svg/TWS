'use strict';
// Run after npm install: npm run test:ko
// This is intentionally separate from fast mock-based tests.
const {loadKoreanChecker}=require('../koreanChecker');
const {validateWord}=require('../wordRules');
(async()=>{
 const checker=await loadKoreanChecker();
 const positives=['학교','학교에서','사람에게도','먹었다','먹었는데','갔어요'];
 const negatives=['헵듕뜌쫍'];
 let accepted=0;
 for(const token of positives){
  try{validateWord(token,'ko',null,checker);console.log('OK',token);accepted++;}
  catch(err){console.log('REJECTED',token,err.message);}
 }
 for(const token of negatives){
  try{validateWord(token,'ko',null,checker);console.log('ACCEPTED (review)',token);}
  catch(err){console.log('BLOCKED',token,err.message);}
 }
 if(accepted<3){console.error('Korean dictionary acceptance is unexpectedly low');process.exitCode=1;}
})().catch(err=>{console.error(err);process.exitCode=1;});
