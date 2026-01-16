import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRETE = "karishmacnieucuhf938723";

export const UserMiddlware =async(req : Request , res : Response , next : NextFunction) => {
    const token = req.headers["token"];
    const decoded = jwt.verify(token as string,JWT_SECRETE);
    if(decoded){
        // @ts-ignore
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(403).json({
            msg : "you are not loged in"
        })
    }
}