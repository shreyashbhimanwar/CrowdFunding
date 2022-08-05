// Truffle is a provider to connect with infura.io
// infura creates a node for us to test in rinkby test network
// we can also create a node in local network but it takes lot of efforts

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
//we will require capaign factory json build
//we will use campaign factory i  future to deplo campaign 
//so no need to import bytecode
// const {interface, bytecode} = require('./compile');
const compiledFactory= require('./build/CampaignFactory.json')

// setting up provider to contact to our metamask account and infura node
const provider = new HDWalletProvider( // creating new constructor
    'seed finish fashion bacon civil shell produce history vacant annual artist area', // ur acc menumonic
    'https://rinkeby.infura.io/v3/e806fefc069e435f8c96a78bf9365cf7' // ur infura acc node link
);

// this is completrly unlocked instance to connect to rinkeby network
// this instance is used for everything, send ether, setup contarcts and etc.        
const web3 = new Web3(provider); // // creating new constructor


// since during test, we used async - await for getting accounts and creating contract,
// here also we have to use async 

const deploy = async ()=>{

    const accounts = await web3.eth.getAccounts();
    console.log('Getting Account for you:' , accounts[0]);
    // we are parsing json parsing compiled factory interface
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data :compiledFactory.bytecode})
        .send({from : accounts[0],gas : '10000000', gasPrice:'2000000000'});
    // console.log(interface)
    console.log("Contract deployed to:" , result.options.address);
    // we will use this address to check 
}
//when people start to crete campaigns using web3 inside of app to interact with deployed instances
//so yes we need json file for both
deploy();