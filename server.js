const {createServer} =require('http')
const next=require('next')

const app =next({
    //whether we are running in production or development mode
    dev:process.env.NODE_ENV !='production'
})

//navigation logic
const routes =require('./routes')
const handler= routes.getRequestHandler(app)

app.prepare().then(()=>{
    createServer(handler).listen(3000,(err)=>{
        if(err) throw err;
        console.log('Ready on localhost:3000')
    })
})
