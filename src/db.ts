import mongoose  from "mongoose";
import { Schema , Model } from "mongoose";
import {ObjectId} from "mongoose";
import { boolean } from "zod";

const user = new Schema({
    username : {type: String , require: true , unique: true} ,
    password : {type: String , require: true}
});

export const usermodel = mongoose.model("users" , user);

const content = new Schema({
    type : String,
    title : String,
    link : String,
    share : boolean,
    tag : [{type:mongoose.Types.ObjectId , ref: 'tag'}],
    userId : {type: mongoose.Types.ObjectId , ref: 'users' , require: true}
});

export const contentmodel = mongoose.model("contents" , content);

const link = new Schema({
    share : boolean ,
    shareLink : String ,
    userId : {type : mongoose.Types.ObjectId , require:true , unique : true}
})

export const linkModel = mongoose.model("links" , link);