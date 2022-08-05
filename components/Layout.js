//common logi for all pages
import React from "react";
import { Container } from "semantic-ui-react";

//header at top and foooter at bottom
//ratherr than importing layout and put into the pages
//i will take capaignindex component and show it inside the layout 
//react has greate system called child system
//content inside layout is going to be swapped out depending on pages
// so capaign index component is child of layout

/*****************header ************/
//we are looking for navbar inside semantic ui website collectins=>menu
//logo on lhs and two button on RHS
//syntaxt for that is 
/*<Menu>
    <Menu.Item
    name='browse'
    active={activeItem === 'browse'}
    onClick={this.handleItemClick}
    >
    Browse
    </Menu.Item>
</Menu>
*/
//component uses inside any react component
import Head from 'next/head'

import Header from "./Header";
export default(props)=>{
  return(
    <Container>
        
        <Header/>
        {props.children}
        
    </Container>
  )
}