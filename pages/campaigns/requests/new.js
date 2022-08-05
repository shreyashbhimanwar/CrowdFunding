import React from "react";
import { render } from "react-dom";
import 'semantic-ui-css/semantic.min.css'
import { Form,Button,Message, Input } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import {Link,Router} from '../../../routes'
class RequestNew extends React.Component{
    state ={
        value:'',
        description:'',
        recipient:'',
        loading:false,
        errorMessage:''
    }
    
    static async getInitialProps(props){
        const {address}= props.query
        return{address}
    }
    OnSubmit= async(event)=>{
        event.preventDefault();
        //get access to campaign instance
        const campaign= Campaign(this.props.address);
        //to call create request we need description value and recipient address
        //recording on state object
        const {description,value,recipient}=this.state;
        this.setState({loading:true,errorMessage:''})
        try{
            const accounts=await web3.eth.getAccounts();
            //pass the value in createrequest wei
            //finalize request we call transfer method in wei
          
            await campaign.methods.createrequest(description,web3.utils.toWei(value,'ether'),recipient)
            .send({from:accounts[0]})

            //after succesful creation of request we will reroute to capaigns/requests
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        }catch(err)
        {
               this.setState({errorMessage:err.message})
        }
        this.setState({loading:false})

    }
    
    render(){
        return (

            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                 <a>
                    Back
                 </a>
                </Link>
                <h3>Create a Request!</h3>
                <Form onSubmit={this.OnSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                        value ={this.state.description} 
                        onChange={event=>this.setState({description:event.target.value})}
                        /> 
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                        value ={this.state.value} 
                        onChange={event=>this.setState({value:event.target.value})}
                        /> 
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                        value ={this.state.recipient} 
                        onChange={event=>this.setState({recipient:event.target.value})}
                        /> 
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button primary loading={this.state.loading}>
                        Create
                    </Button>
                </Form>
            </Layout>
           
        )
    }
}
export default RequestNew