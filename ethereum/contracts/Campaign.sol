pragma solidity ^0.4.17;
//adding factory contract which will record all deployed instances of campagins
//**campaign factory**//
///deployed address - adress[]  adress of all deployed campgaings
//function
//createcampgain deploy new instance of capmgain and  store to resulting address
//getdeployedcamp[gaings return allthe list of all campgaings 
// we want be able to retrive it all so we uses function

contract CampaignFactory{
  address[] public deployedCampgains;
  //receive minimum argument and give to constrctor
  function createcampgain(uint minimum,string name,string description,string image) public {
        address newCampaign = new Campaign(minimum, msg.sender,name,description,image);
        deployedCampgains.push(newCampaign);

  }
  //little gotcha in camgain function we need adress of manager which will set the manager 
  //manager is originally asked who for new instanve of campgain
  //so call the argument and pass to constructor
  function getdeployedcamp() public view returns(address[]){
    return deployedCampgains;
  }
}


contract Campaign{
  //dont problem the adress of manager to be oublic but it shpuld be public to give miney to campaign
  //define the struct usually start with capital R
  struct Request {
    string desciption;
    uint value;
    address recipient;
    bool complete;
    uint approvalcount;
    mapping(address => bool) approvals;
   
  }

  Request[] public requests;
 //struct does not create any instance but variable creates it
 
 //********** */
  string public CampaignName;
  string public CampaignDescription;
  string public imageUrl;
//************* */

  address public manager;
  uint public minimumContribution;
  // address[] public approvers; change this to mapping refactor 
  //mapping(address =>bool)
  mapping(address => bool) public approvers;
 uint public approversCount;
  //**function modifier for create request //**
  // only manager should be able to call it 
  // make sure restrict access to this function
    modifier restricted()
    {
      require(msg.sender==manager);
      _;
    }
  function Campaign(uint minimum,address creator,string name,string description,string url)public{
     manager=creator;
     minimumContribution=minimum;
      CampaignName=name;
      CampaignDescription=description;
      imageUrl=url;
  }
  //fun contribute is called when someone want send money to contract
  //payable as we need to pass
  //check amount of money 
  function contribute() public payable{
    require(msg.value>minimumContribution);
     approvers[msg.sender]=true;
     approversCount++;

  }

  //sending requests
  //manager call the createrequest
  //type of request 
  //public as be called from external account
  //****request struct*****
  //describe -string -describes why the request is being created to explain the contrbutor why the request made
  //value -uint - amount of money wants to send 
  //recipient -address -- address of vendor 
  //complete - bool -whether or not request has been executed true uf the request hgas already been processed
  //how  to vote process by contributors is remaining 

  

  //pupose of this is to create new struct and addd to it 
  // we need description,value,vendor adress as arg
  // storage and memeory error msg
   

  function createrequest(string desciption, uint value,address recipient) public restricted{
           Request memory new_request=  Request({
              desciption:desciption,
              value:value,
              recipient:recipient,
              complete:false,
              approvalcount:0
               //no need to initialize a reference type
              //only value types are added

             //  Request(desciption,value,recipient,false);//alternate syntax provide only values
           });
          
           
           requests.push(new_request);
  }

  //approve request is called by contributor
  // yes i approve or  no i will not approve
  //requirement  1:single contrib dont vote multiple times so keep track of who has voted which one
  //2: if many contribs (hundrededs and thousands people contributing) ypu should handle it
  

  //***Wrong system**/
   //contract

   //address[] of             request 1 adress[] of vote   uint of yes  uint of  no  //check for the adress and whether done only one time
    //contrib               request 2 adress[] of vote   uint of yes  uint of  no  //check for the adress and whether done only one time

/*possible way of approve request*/

  // function approverequest(Request request) public{
  //   bool isApprover=false;
  //   for(uint i=0;i<approvers.length;i++)
  //   {
  //     isApprover=true; 
  //   }
  //Above approch is poor logic to check if approver is valid cause 10000 gas
  //   require(isApprover);

  //   //make sure calling this function hasnot voted
  //   for(uint i=0;i<request.approvers.length;i++)
  //   {
  //     require(request.approvers[i]!=msg.sender); //may cause 5000 gas
  //   }

  // }

//for 1 contrib checking is called a member 10000 gas+ checking called has voted before cause 5000 gas = 15000 gas for one person
//how to our gas price increase 
// if we 10000 contrib then it will cause total gas * 10000 ie 100 MILLION gas
// so here we have designed in such a way that array grows infinitely so somehow restrict it 
//so cap the number of adress 
// so this is problem with array data structure so you should be sure that your contract never end up infinitely
//so this is too expensive as we have to loop throgh and we have to spend a large amput of money for same


//****Mapping vs Arrays **//
//to solve this issue we store the values in mapping 
//collection of key value pairs
//Why a mapping solve our problem
//Array ->Linear time search(size of array detates it )
//Map ->Constant time search(doenot depend on the contribs)

//Javascript object 

//                  Mapppings
                // keys are not stored
//   we use hashtable where we use lookup process we have to provide key
//key- > hash function ->index value   ----> return values at index
//values are not iterable we cannot loop and print values
//cannot fetch all the values
//with solidity mapping all values exist ie the value will be '' if type is string 
//if interger type then we get 0 value so it is challenging to get values inside a mapping 


// approveres should be mapping due to constant time lookup of type address
//appovalcount and mapping of approvals  is used inside struct to 


//in order to pass a particular request we have to pass index of the reuest ypu are trying to approve
//0 based indexing is used
//in these case we are not searching but lookup on array so no iteration so we will save gas

function approverequest(uint index) public {
     Request  storage request =requests[index];
     require(approvers[msg.sender]); //check approver is contributor
     require(!request.approvals[msg.sender]) ;//check whether this person has already voted 
    request.approvals[msg.sender]=true;
    request.approvalcount++;
}

// finalize request afterr the voting has done
//this request should not be marked as compllete 
//if finalize then complete =true
function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalcount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }


  function getsummary() public view returns(
    uint,uint,uint,uint,address,string,string,string
  ){
      return (
        minimumContribution,
        this.balance,
        requests.length,
        approversCount,
        manager,
        CampaignName,
        CampaignDescription,
        imageUrl
    );
  }
  function getRequestsCount() public view returns(uint)
  {
      return requests.length;
  }
  

}