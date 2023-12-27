const express = require("express");
//import routes
const authRout = require('./routes/auth');
const usersRout = require('./routes/crudUsers');
const recipesRout = require('./routes/crudRecipes');
const postRout = require('./routes/post');
const application = express();
const dotenv = require('dotenv');
const  cors =require ('cors');
dotenv.config();
const mongoose = require("mongoose");
// connect DB
const connect = mongoose.
                connect(
                   process.env.DB_CONNECT
                    ).
                then(()=>{
                    console.log("Connection established");
                }).
                catch((err)=>{
                    console.log("Connection failed !!!" , err);
                }); 
/**
 * body parser
 */
application.use(express.json());
application.use(cors());
/**
 * create middle ware routes
 */
application.use('/api/user',authRout);
application.use('/api',usersRout);
application.use('/api/recipes',recipesRout);
application.use('/api/post',postRout);
/**
 * create the listener for the server
 */
application.listen(process.env.SERVER_PORT,()=>{
    console.log("server Up and running on port:", process.env.SERVER_PORT);
})