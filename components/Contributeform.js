import { Router } from "../routes";
import React from "react";
import 'semantic-ui-css/semantic.min.css'
import {Button, Form,Input,Message} from 'semantic-ui-react'

// we will import campaign which will give us instance of the campaign address
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
class ContributeForm extends React.Component{
    state={
        value:'',
        erroMessage:'',
        loading:false
    
    }

    OnSubmit= async(event)=>{
        event.preventDefault();
        //at any time many campaigns active so we must specify which campaign this person is donating
        //CampaignShow (knows what address of the contract the user is looking at)===>address(through url)==> ContributeForm(Need to know the CampaignAddress)
        const campaign = Campaign(this.props.address)
        //reset the error message when the Onsubmit is called or resubmit the form
        this.setState({loading:true,erroMessage:''})
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
              from: accounts[0],
              value: web3.utils.toWei(this.state.value, 'ether')
            });
            //after the contribution we have to refresh the page 
            //this will not automatically update
            // we have to refresh source updater
            // so to rerun we have to update the getInitial props inside campaigns/show
            //to refresh the component use our router object to refesh the current route we are looking at
            //rather than goiing to another route we will refresh the current route so that to get new data
            //pushroute creates new entry in browserr history
            // we dont want to go back 
            //if refresh we will rerun getInitial props and will get the new data
            Router.replaceRoute(`/campaigns/${this.props.address}`)

        }catch(err){
              this.setState({erroMessage:err.message});
        }
        //reset the value to clear the input on form and loading false will cause button to stop spinning 

        this.setState({loading:false,value:''})
    }
    //handle the error using errormessage using Message component and to convert string to bool use !! logicc
    render(){
        return(
            <Form onSubmit={this.OnSubmit} error={!!this.state.erroMessage}>
                <Form.Field >
                  <label>Amount to Contribute</label>
                  <Input 
                  value={this.state.value}
                  onChange={event=>{this.setState({value:event.target.value})}}
                  label="ether" labelPosition="right" />
                </Form.Field>
                <Message error header="Oops !" content={this.state.erroMessage}/>
                <Button primary loading={this.state.loading}>Contribute!</Button>
            </Form>
        )
    }
}
export default ContributeForm