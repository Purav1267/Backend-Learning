import express from "express";
// const express = require("express")
// import statement gives us error sometimes as it is async 
// but this const express is synchronus so it doesn't error 
// and this const express statement is old statement as well as sync


// to fix the import error coming due to async 
// we just have to go to package.json file and above the script 
// we just have to write "type":"module" in it to fix this error
// and this type: module means we have to assemble every js file in a 
// module not as regular js files 
// or in easy language we can say that we want to save every js file
// like in a structure based module not like every single file is running
// executing. it should be like many files share information with each other

const app = express()

// app.get("/",(req,res)=>{
//     res.send("Server is ready")
// })

// So here i was doing that bad practise like downloading all the 
// frontend code using the line 


// npm run build

// this makes a dist folder which consist of all the frontend react
// like react into basic html , css , js and now the thing is we just 
// push all that frontend through our backend only means 
// with only deploying the backend folder we can just deploy our whole 
// project but there is a issue here if we want to change our frontend
// then we have to remove this dist file from here and make another 
// dist file and then make the changes accordingly. this thing
// help us in not deploying our app on AWS , AZURE or making CI/CD 
// pipeline or something. it just saves you alot of server cost 
// it just make our work easy with vercel or any easy 
// deploying cloud service.


app.use(express.static('dist'));

// so this line is the middleware
// this means that we are saying to express to use the static file
// dist in the backend while running their backend


// now when we just start the backend server it will automatically 
// give us the whole app within it because of dist file in it.




// app.get("/",(req,res)=>{
//     res.send("Server is ready")
// })
// get a list of 5 jokes
app.get("/api/jokes",(req,res)=>{
    const jokes = [
        {
            id:1,
            title:"A joke",
            content: "This is a joke"
        },
        {
            id:2,
            title:"A 2nd joke",
            content: "This is 2nd joke"
        },
        {
            id:3,
            title:"A 3rd joke",
            content: "This is 3rd joke"
        },
        {
            id:4,
            title:"A 4th joke",
            content: "This is 4th joke"
        },
        {
            id:5,
            title:"A 5th joke",
            content: "This is 5th joke"
        }
    ]
    res.send(jokes)
})

const port = process.env.PORT || 3000

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`);
})

