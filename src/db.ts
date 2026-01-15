import mongoose  from "mongoose";
import { Schema } from "mongoose";
import {ObjectId} from "mongoose";

const user = new Schema({
    username : {type: String , require: true , unique: true} ,
    password : {type: String , require: true}
});

const usermodel = mongoose.model("users" , user);

module.exports = {
    usermodel : usermodel,
};