const routes =require('next-routes')() //return function that execute immediately after import
//setup routes who have custom tokens

//we want to show the show route if we have campaigns/something
// : wildcard which takes the argument 
//: this part is variable of source
//second argument is what we want to show

routes
.add('/campaigns/new','/campaigns/new')
.add('/campaigns/:address','/campaigns/show')
//broke campaigns/new so we will add another roite mapping which will fix 
//the above is overriding default navigation of nextjs
//add the new route before it

//*****requests route */
.add('/campaigns/:address/requests','/campaigns/requests/index')
.add('/campaigns/:address/requests/new','/campaigns/requests/new')

module.exports =routes;
//export helpers that allows users to navigate over app
//setup server.js so that we can manually boot up and use routes.js
