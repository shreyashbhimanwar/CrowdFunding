//show the campaign details
import React from "react";
import 'semantic-ui-css/semantic.min.css'
import { Card,Grid ,Button} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import {Link} from "../../routes"



//import contribute form for the contribution
import ContributeForm from "../../components/Contributeform";

// we will import campaign which will give us instance of the campaign address
import Campaign from "../../ethereum/campaign";

//we want wo get a handle on campaign that we are looking and call getsummary function
//when we want ro fetch data inside of pagecomponent we use getinitalprops methods


class CampaignShow extends React.Component{
    static async getInitialProps(props){
        //one diff is that we are tring to show info about the one campaign which adress is in url
        // we can capture the token inside address parameter the value of it
        // *** props.query.address;
         //remeber we shoulf always return the object 
         //console log is inside server as we are using server side rendering so initially cosole the log in server side
         // we use web3 to get the address of the contract
         //we will create another file to setup the contract code
          
            const campaign=Campaign(props.query.address)
            const summary = await  campaign.methods.getsummary().call();
            
            return {
                address:props.query.address,
                minimumContribution:summary[0],
                balance:summary[1],
                requestCount:summary[2],
                approversCount:summary[3],
                manager:summary[4],
                name: summary[5],
                description: summary[6],
                image: summary[7],

            }
        }

    //helper finction that will help us to create cards
    renderCards(){
        //we will do it manually as 4 objects are there and they are different 
        const {
            minimumContribution,
            balance,
            requestCount,
            approversCount,
            manager,
            name,
            description,
            image
        }=this.props;
        const items=[
            {
                header: <img src={image} style={{ width: 100, align: "center"}} />,
                meta: name,
                description: description
            },
            {
                header:manager,
                meta:'Address of Manager',
                description:"The manager created this campaign and can create request to withdraw money",
                style:{overflowWrap:'break-word'}

            },
            {
                header:minimumContribution,
                meta:'Minimum Contribution (wei)',
                description:"You must contribute this much of wei to become approver",
                style:{overflowWrap:'break-word'}

            },
            {
                header:requestCount,
                meta:'Number  of request',
                description:"A request tries to withdraw money from contract.Request must be approved by approvers",
                style:{overflowWrap:'break-word'}

            },
            {
                header:approversCount,
                meta:'Number of Approvers',
                description:"The number of people already donated to campaign",
                style:{overflowWrap:'break-word'}

            },
            {
                header:web3.utils.fromWei(balance,'ether'),
                meta:'Campaign Balanace (ether)',
                description:"The balace is how much money this camnpaign has left to spend",
                style:{overflowWrap:'break-word'}

            },
        ]
        return <Card.Group items={items}/>
    }
    
    render(){ 
      return(
            <Layout>
                <h3>Campaign Show </h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                        {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>  
                
                
            </Layout>
        )
    }
}


export default CampaignShow