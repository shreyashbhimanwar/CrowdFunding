// general approch is that we read lottery file with readfilesync and fed to solidity compiler and exported contract
//every time when we start our priject we have to recompile contract each time
///instad i want to compile contract to file file and access that version of file

//capaign sol has 2 contracts we spitt into 2 files and we take both and save it to 
// build
//contracts
//compile.js //store this to build 
//***stps to get output */
//1)delete entire build folder we should be running compile only one time the script we are making some active changes to contract sp dont take previous
//2) read campgain..sol
//3)compile both contracts
//4)output will be conpiled capmgain and compiled campgain  factory
//if any time if we want to read abi we have to read from build folder
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
console.log(output)
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}