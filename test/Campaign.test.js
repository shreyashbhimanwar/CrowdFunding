const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods. createcampgain('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getdeployedcamp().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
//person calling createcampaign should be a manager so make sure manager is ok
  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call(); //we are retriving not calling
    assert.equal(accounts[0], manager); // we have set 0th index as our manager
  });
//what behavious i want so i will use another acc as donator and that address get marked as contributor
  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',//we have minimum contrib of 100
      from: accounts[1]
    });
    //the way to check who is approver mapping has constant time as approvers is public so we get method to access .
    //we lookup single value it will return bool 
    //approvers have arg as key
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);//fail if false value is passed
  });

 //minimum contribution is set 
 // we use try catch attemp to send less contrib 
 //catch it ir catch block 
  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);//test will fail if this line runs i.e is minimum contrib is neededs
    } catch (err) {
      assert(err);
    }
  });
//i want to write fun that asserts that manager has ability for payment request
//create request is changing the contract data so we need to send trasaction
//
  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createrequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0], //manager is trying to send trasaction
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call(); //we made request array so that we can get request
    //we have not created requests previously so try to create new request
    //we cannot retrive mapping as only individual element can be accesed from it

    assert.equal('Buy batteries', request.desciption);
  });
//One end to end test
// these request try to capture everything from start to finish
 // i will  take my campaign 
 //contrib
 //create request 
 //approve 
//try to find that other party has received it or not
  it('processes requests', async () => {
    //contrib
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });
   //create request ans try to send some ether to other
    await campaign.methods
      .createrequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approverequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
  //we dont know how much money accounts have as we are redeploying our contract each time before we run our test
  //we are not doing cleanup of accounts list between tests
  //dont saying that we have exactly greter than 104 balance
  // we have may be used accounts for transaction as it will be used for gas

    assert(balance > 104);
  });
});