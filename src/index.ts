import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import * as z from "zod";
import { ZodError } from "zod";
import { usermodel , contentmodel} from "./db";
import {UserMiddlware} from './middleware'
import e from "express";
mongoose.connect("mongodb+srv://admin:ieiDNs5hmV2mhVFL@cluster0.tp8kfsa.mongodb.net/second-brain");
const salt = genSaltSync(10);
const JWT_SECRETE = "karishmacnieucuhf938723";

const app = express();
app.use(express.json());


const user = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(10, "Username must be at most 10 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


app.post("/api/v1/signup", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        try {
            const cheakvalideation = user.parse({
                username: username,
                password: password
            })
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(411).json({
                    errors: error.message
                });
            }
        }
        const hasspassword = hashSync(password, salt)
        try {
            await usermodel.create({
                username: username,
                password: hasspassword
            })
            res.status(200).json({
                msg: "you are signed up"
            })
        } catch (error) {
            res.status(403).json({
                msg: "user already exist"
            })
            console.log(error);
        }

    } catch (error) {
        res.status(500).json({
            msg: "faild sign up",
            error: error
        })
        console.log(error);
    }

});

app.post("/api/v1/signin", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const finduser = await usermodel.findOne({
            username
        })
        if (!finduser) {
            return res.status(403).json({
                msg: "user does not exist"
            })
        }
        const id = finduser.id;
        if(!finduser.password){
            return res.status(403).json({
                msg: "user does not exist"
            })
        }
        const isMatch = compareSync(password, finduser.password);
        if (!isMatch) {
            return res.status(403).json({
                msg: "password in wrong"
            })
        }

        const token =jwt.sign({
            id : id
        },JWT_SECRETE);
        
        res.status(200).json({
            msg : "sign in",
            token : token
        })
    } catch (error) {
        res.status(500).json({
            msg : "internal server error"
        })
    }
});

app.post("/api/v1/content", UserMiddlware , async (req, res) => {
    const type = req.body.type;
    const link = req.body.link;
    const title = req.body.title;
    try {
        await contentmodel.create({
            type:type,
            link:link,
            title : title,
            // @ts-ignore
            userId:req.userId,
            tag:[]
        })
        return res.status(200).json({
            msg : "content is addded"
        })
    } catch (error) {
        return res.status(403).json({
            msg : "invalid signature"
        })
    }
});

app.get("/api/v1/content", UserMiddlware , async (req, res) => {
    try {
            // @ts-ignore
        const useId = req.userId;
        const content = await contentmodel.find({
            userId : useId
        })
        if(!content){
            res.status(200).json({
                msg : "no content found"
            })
        }else{
            res.status(200).json({
                content
            })
        }
    } catch (error) {
        res.status(403).json({
            msg : "invalid credential"
        })
    }
});

app.delete("/api/v1/content", UserMiddlware, async (req, res) => {
    try {
      const { contentId } = req.body;
       //@ts-ignore
      const userId = req.userId; 
  
      const result = await contentmodel.deleteOne({
        _id: contentId,
        userId: userId,
      });
  
      if (result.deletedCount === 0) {
        return res.status(403).json({
          msg: "not authorized to delete this content",
        });
      }
  
      res.status(200).json({
        msg: "Deleted successfully",
      });
  
    } catch (error) {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  });
  

app.post("/api/v1/brain/share", UserMiddlware , async (req, res) => {

})

app.get("/api/v1/brain/:shareLink", UserMiddlware , async (req, res) => {

});

app.listen(3000);