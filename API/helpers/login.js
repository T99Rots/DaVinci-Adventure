const keyStore = require('../models/key-store');

const config = require('../config/config');
const maxNum = (10 ** config.codeLength) - 1;

const promise = (async () => {
  let iteration = await keyStore.get('access_code_iteration');
  let seed1 = await keyStore.get('access_code_seed_1');
  let seed2 = await keyStore.get('access_code_seed_2');
  
  const save = () => {
    keyStore.set('access_code_iteration', iteration);
    keyStore.set('access_code_seed_1', seed1);
    keyStore.set('access_code_seed_2', seed2);
  }
  
  if(!iteration || !seed1 || !seed2) {
    iteration = 0;
    seed1 = Math.floor(1e9*Math.random());
    seed2  = Math.floor(1e9*Math.random());
    save();
  };
  
  const calculateResidue = (x) =>  {
    const residue = x * x % maxNum;
    return (x <= maxNum/2) ? residue : maxNum - residue;
  }
  
  valueForIndex = (index) => {
    const first = calculateResidue((index + seed1) % maxNum);
    return result = calculateResidue((first + seed2) % maxNum);
  };

  return () => {
    const code = valueForIndex(iteration++);
    save();
    return code;
  }
})();

exports.generateAccessCode = async () => (await promise)();

exports.generateToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for(let i = 0; i < 64; i++) {
    result+= characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}