/**
 * import express library
 */
const express = require("express");
/**
 * import mongoose library
 */
const mongoose = require("mongoose");
/**
 * create the connection to the data base
 * mongodb+srv://cuisineApp:<password>@cluster0.x1y1wyy.mongodb.net/?retryWrites=true&w=majority
 */
const connect = mongoose.
                connect("mongodb+srv://cuisineApp:seyunKHsi4DYndvm@cluster0.x1y1wyy.mongodb.net/?retryWrites=true&w=majority").
                then(()=>{
                    console.log("Connection established");
                }).
                catch((err)=>{
                    console.log("Connection failed !!!" , err);
                }); 
/**
 * create instance from the express library
 */
const application = express();
/**
 * to receive the parms on body request we need to configure express to accept the encode in the body request
 */
application.use(express.json());
/**
 * 
 */
application.get("/",(request,response)=>{
response.json(
   {
    status:200,
    name: "isLogged"
   }
);
});

/**
 * create listener form the server
 */
application.listen(80,()=>{
    console.log("I am listening on port 80");
});