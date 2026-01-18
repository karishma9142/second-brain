import express, { json, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import * as z from "zod";
import { ZodError } from "zod";
import { usermodel , contentmodel ,linkModel} from "./db";
import {UserMiddlware} from './middleware'
import {randomUUID} from "crypto";
import { link } from "fs";
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
    const share = req.body.share;
    try {
        await contentmodel.create({
            type:type,
            link:link,
            title : title,
            share : share,
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
    // @ts-ignore
    const userId = req.userId;

    try {
        const share = await linkModel.findOne({
            userId : userId
        })

        if(!share){
            const  shareLink = crypto.randomUUID();
            await linkModel.create({
                shareLink : shareLink ,
                share : true ,
                userId : userId
            })
            return res.status(200).json({
                msg  : "link created succesfully",
                link : shareLink
            })
        }else{
            res.status(200).json({
                msg : 'link already created'
            })
        }
    } catch (error) {
        res.status(500).json({
            msg : "internal server error"
        })
    }
});

app.patch("/api/v1/brain/share/dec" ,UserMiddlware, async(req : Request , res:Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const link = await linkModel.findOne({
            userId : userId
        })
        if(!link){
            return res.json({
                msg  : "link does not exit"
            })
        }
        link.share = false;
        await link.save();
        res.status(200).json({
            mg  : "link deactivated"
        })
    } catch (error) {
        res.status(500).json({
            msg : "internal server error"
        })
    }
});

app.patch("/api/v1/brain/share/active" ,UserMiddlware, async(req : Request , res:Response) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const link = await linkModel.findOne({
            userId : userId
        })
        if(!link){
            return res.json({
                msg  : "link does not exit"
            })
        }
        link.share = true;
        await link.save();
        res.status(200).json({
            mg  : "link deactivated"
        })
    } catch (error) {
        res.status(500).json({
            msg : "internal server error"
        })
    }
});


app.get("/api/v1/brain/:shareLink", async (req, res) => {
    try {
        const {shareLink} = req.params;
        const findLink = await linkModel.findOne({
            shareLink : shareLink ,
            share : true
        })
        if(!findLink){
            return res.status(403).json({
                msg : "invalid link"
            })
        }
        if(!findLink.userId){
            return res.status(403).json({
                msg : "user does not exit"
            })
        }
        const userId = findLink.userId;
        const user = await usermodel.findById(userId);
        if(!user){
            return res.status(404).json({
                msg : "user does not exit"
            })
        }
        const username = user.username;
        const content = await contentmodel.find({
            userId : userId ,
            share : true
        })
        if(content.length==0){
            return res.status(200).json({
                msg : "no public content exit"
            })
        }
        res.status(200).json({
            username : username,
            content : content
        })
    } catch (error) {
        res.status(500).json({
            msg : "internal server error"
        })
    }
});

app.listen(3000);