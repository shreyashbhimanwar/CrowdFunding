//render one individual route
import React from "react";
import 'semantic-ui-css/semantic.min.css'
import {Table,Button} from 'semantic-ui-react'
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

//number of approvers are inside the approvalcount 
//total number of approvers are approversCount
class RequestRow extends React.Component{
    //how we approve request
    //we have function approvereqyest we have to pass index of request
    onApprove = async () => {
        const campaign = Campaign(this.props.address);
    
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approverequest(this.props.id).send({
          from: accounts[0]
        });
      };
    
      onFinalize = async () => {
        const campaign = Campaign(this.props.address);
    
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
          from: accounts[0]
        });
      };
      render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        //flag to indicate whether the request is ready to finalize or not
        const readyToFinalize = request.approvalCount > approversCount / 2;
    
        return (
            //if request is finalized then disable the row
            //positive is the flag tied tosemantuc ui if true to this it will highlight our row
            //then it will makred as greeen
          <Row
            disabled={request.complete}
            positive={readyToFinalize && !request.complete}
          >
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
              {request.approvalcount}/{approversCount}
            </Cell>
            {/* check for the completion of request if yes then dont allow this button ie is approve button and finalize button will be hidden */}
            {/* hide button if true */}
            <Cell>
              {request.complete ? null : (
                <Button color="green" basic onClick={this.onApprove}>
                  Approve
                </Button>
              )}
            </Cell>
            <Cell>
              {request.complete ? null : (
                <Button color="teal" basic onClick={this.onFinalize}>
                  Finalize
                </Button>
              )}
            </Cell>
          </Row>
        );
      }
}

export default RequestRow