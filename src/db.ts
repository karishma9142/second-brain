import mongoose  from "mongoose";
import { Schema , Model } from "mongoose";
import {ObjectId} from "mongoose";

const user = new Schema({
    username : {type: String , require: true , unique: true} ,
    password : {type: String , require: true}
});

export const usermodel = mongoose.model("users" , user);

const content = new Schema({
    type : String,
    title : String,
    link : String,
    tag : [{type:mongoose.Types.ObjectId , ref: 'tag'}],
    userId : {type: mongoose.Types.ObjectId , ref: 'users' , require: true}
});
export const contentmodel = mongoose.model("contents" , content);