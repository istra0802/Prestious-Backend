const express = require("express");
// const users = require("./MOCK_DATA.json")
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8000;
const userRouter = require("./routes/user")
const { logReqRes } = require("./middlewares")
const { connectionMongoDb } = require("./connection")


// connection

connectionMongoDb('mongodb+srv://isha:isha2002@cluster0.omniv6e.mongodb.net/mongoDbTry?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("mongo connected ")).catch((err) => console.log(err))

// Define CORS options
const corsOptions = {
  origin: "*", // Replace with the origins of your frontend
  exposedHeaders: ['X-Total-Count'],
};

// middleware plugin
app.use(express.json())
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }))
app.use(logReqRes('log.txt'))




app.use("/api/users",userRouter)
app.listen(port, () => console.log(`Server started at ${port}`))

// good practise  to make hybrid server
//  if i want to show the json data than write api in the route 
// if i want o show html data than do not add api in the route 

//  x- is used to define a custom header field it is optional

  //  below was the case when we were not using mongo db 
    // const id = Number(req.params.id)
    // console.log(id, " ------------------------ ")

    // const user = users.find((user) => user.id === id);

// find ({}) means it will find all the users

// dynamic path paramteer 
//  api/users/:id 
//  which the id could be anythig and it is a variable



   // this is only a case whe we are not connected t mongoose  
    // users.push({...body, id: users.length+1});
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data) => {
    //     return res.status(201).json({status:"success" , id: users.length })
    // })


    //    return res.json({status: "pending"})



//  status code


// 404 - not found
//200- 299 - ok - succesful status code
// 201 - created successfully
// 202 - successfully accepted

// 400 -499 client error request

// 400 - bad request
// 401 - unauthorized

//  500 - server side error

// construstion 
