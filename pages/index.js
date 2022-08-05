import React from 'react'
import factory from '../ethereum/factory'
import{Card, Button, Grid,Image} from 'semantic-ui-react'
import Layout from '../components/Layout'
import {Link} from '../routes'
//next does not have the support for css
//so add and paste link tag
import 'semantic-ui-css/semantic.min.css'
import Campaign from '../ethereum/campaign.js';


class CampaignIndex extends React.Component{
  //any data fetching should be inside of component did mount is ok with react
  //but we are using next which uses server side rendering 
  //server side rendering attemps to render component on server and take all html and send tobrowser
  //cache is that if we want to do data fetching next does execute at next server unofortunately next does not execute componentdidMount method on server
  //when our app is rendered by next on server this componentdidMount method does not execute
  //so use getinitalprops fnction
  //static keword define class function
  //we have to create instace to access it 
  //but static keyword this function is assined to class itself not instance
  //why require?
  //next want to retrive data without rendering as it is computationally expensive
  //so by skipping rendering next ablee to make sever side rendering easy
 

  state={
    items:'',
    summary:''
  }

  static async getInitialProps(){
    const campaigns=await factory.methods.getdeployedcamp().call();
    return {campaigns} // object is retuned by it 
  }


  //this will call the campaign at particular address and get the summary of it 
  async componentDidMount(){
    const c = Campaign(this.props.campaigns[0]);
    const summary = await Promise.all(this.props.campaigns.map((campaign, i) => Campaign(this.props.campaigns[i]).methods.getsummary().call()));
    this.setState({summary});
  }

  //render components for rendering the card groups
  //each has header and snippet property
  renderCampaigns(){
     let summ
    const items= this.props.campaigns.map((adress,i)=>{
      if (this.state.summary) summ = this.state.summary[i];
      else summ = {"5": "null", "7":"null"};
      console.log(summ)
      // return {
      //   header:adress,
      //   description:(
      //   <Link route={`/campaigns/${item}`}>
      //      <a>View Campaign</a>
      //   </Link>
       
      //   ),
      //   fluid:true //group of cards have width constraint that is it cant strech to right hand
      //   // side of container by fuild =true its going to strech to the far RHS not going to interfere with createcapaign button
      // }
    return{
      key:i,
      image: <img src={summ[7]} style={ {width:150}} />,
      header: summ[5],
      meta: adress,
      description: <div>
                    <Link route={`/campaigns/${adress}`}><a>View Campaign &nbsp;</a></Link>
                
                  </div>,
      fluid:true,
      style: {overflowWrap: 'break-word'}
    };
      
    

    })
    return <Card.Group  items = {items} />;
  }
  
  // async componentDidMount(){
  //       const campaigns=await factory.methods.getdeployedcamp().call();
  //       console.log(campaigns)
  //   }
    render(){
      //here we can use this.props.campaigns
      return (
       <div>
        <Layout> 
        <h3>Open Campaign</h3>
        <Grid >
            <Grid.Row>
                <Grid.Column width={12}>
                        {this.renderCampaigns()}
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Link route="/campaigns/new">
                                <a>
                                  <Button floated='right' content="Create Campaign" icon="add circle" primary={true}/>  
                                </a>
                          </Link>
                        </Grid.Column>
                    </Grid.Row>
         </Grid>
             
        </Layout>
        
       </div>
      )
    }
}
export default CampaignIndex;