import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0xf19fD70799f92E053631CE4f2A6c7AbdF1eFF914');

export default instance;