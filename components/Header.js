import React from "react";
import { Menu ,Image,Icon} from "semantic-ui-react";
//mENU.Menu gives us another menu hamburger kins of thing on right
//Link helper allows us to create link tag that user can use to navigate around themselves

import {Link} from '../routes'


//menu .item and link tag styles classh with each other
//we will use onl link tag instead of menu.item tag
//Link tag is generic wrappper component without having html of own wrap children with clickevent handler
//if we click on children which will automaically navigation allowed
//classname =item is semantic ui item
export default () => {
    return(
       <Menu style={{marginTop:'10px'}}>
            <Menu.Item>
                  <Icon color='black' name='ethereum'  size='big'/>
           </Menu.Item>
            <Link route="/" >
                <a className="item" size='huge'>
                    <h4>CrowdFunding</h4></a>
            </Link>
            
            <Menu.Menu position="right">
                <Link route="/" >
                    <a className="item">
                        <h4>Campaigns</h4></a>
                </Link>
                <Link route="/campaigns/new" >
                    <a className="item"><h4>+</h4></a>
                </Link> 
            </Menu.Menu>
       </Menu>

    )
}