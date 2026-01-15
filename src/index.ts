import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// import {usermodel} from "./db";
mongoose.connect("mongodb+srv://admin:ieiDNs5hmV2mhVFL@cluster0.tp8kfsa.mongodb.net/share-brain");
const app = express();
app.use(json());

app.post("/api/v1/signup" , async(req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    
});

app.post("/api/v1/signin" , async(req , res) =>{

});

app.post("/api/v1/content" , async(req , res) => {

});

app.get("/api/v1/content" , async(req , res) => {

});

app.delete("/api/v1/content" , async(req , res) =>{

});

app.post("/api/v1/brain/share" , async(req , res) => {

})

app.get("/api/v1/brain/:shareLink" , async(req , res) => {

});

app.listen(3000);