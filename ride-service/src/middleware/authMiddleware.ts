import { Request, Response } from "express";

export default function AuthMiddleware(req:Request,res:Response){
    if(!req.headers.authorization){
        res.send(300).json({error:"user not authorized"})
    }
}