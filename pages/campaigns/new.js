import React from "react";
import Layout from "../../components/Layout";
import { Form,Button,Input,Message } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import factory from '../../ethereum/factory'
import web3 from "../../ethereum/web3";
import {Router} from '../../routes'
//link object is react component that allows us to render anchor tag in react component 
//router object allows user to redirect preople from one page to another



class CampaignNew extends React.Component{
    state={
        minimumContribution:'', //user input so we have to deal with string always
        errorMessage:'',  //state system is used when error is thrown for transaction
        loading:false,
        campaignName:'',
        description:'',
        imageUrl:''
    }
    onSubmit=async(event)=>{
       event.preventDefault(); //keep browser from attempting to submit the form automatically
       //create new campaign  
       //by importiung factory instance innside factory.js
       //we will call createcampaign with minimum contrib which automatically deploy new campaign for us 
       //it will force user to pay it which is exact behaviour
      this.setState({loading:true,errorMessage:''})
       try{
            const accounts=await web3.eth.getAccounts();
            await factory.methods.createcampgain(this.state.minimumContribution,this.state.campaignName,this.state.description,this.state.imageUrl)
            .send({
                //so if wecall function on browser we dont have to specify the amount of gas 
                //but we need for testing purpose 
                //user must atleast have one account 
                from:accounts[0]

            })
            //after creation of succesful creation of contract redirect to index
            Router.pushRoute('/')
        }catch(err)
        {
            this.setState({errorMessage:err.message})
        }
        this.setState({loading:false})
    }
    render (){
   
    return (
        <Layout>
        <h3>Create a campaign</h3>
           <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                    label="wei" 
                    labelPosition="right" 
                    value={this.state.minimumContribution} 
                    onChange={
                        event => this.setState({minimumContribution: event.target.value})
                      }
                    />
                </Form.Field>
                <Form.Field>
                    <label>Campaign Name</label>
                    <Input
                    value={this.state.campaignName}
                    onChange={
                        event => this.setState({campaignName: event.target.value})
                    }
                    />
                </Form.Field>
                <Form.Field>
                    <label>Campaign Description</label>
                    <Input
                    value={this.state.description}
                    onChange={
                        event => this.setState({description: event.target.value})
                    }
                    />
                </Form.Field>
                <Form.Field>
                    <label>Image Url</label>
                    <Input
                    value={this.state.imageUrl}
                    onChange={
                        event => this.setState({imageUrl: event.target.value})
                    }
                    />
                </Form.Field>
                <Message error header="Oops" content={this.state.errorMessage}/>
                <Button loading={this.state.loading} primary>Create</Button>
            </Form>
        </Layout>
    )
 }
}
export default CampaignNew