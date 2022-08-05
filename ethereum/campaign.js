import web3 from "./web3";

import Campaign from "./build/Campaign.json"

//create dfunction receive address and use address to create new contract and return that 
//inside campaign.js file we can call the function that we export from it with this address and should reeturn back us instance of campaign contract
export default (address)=>{
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    )
}