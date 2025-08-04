import Express from 'express'
import User , {Role} from '../models/User'
import DB from '../db/db_client'
import Bcrypt from '../utility/bcrypt/hash'
import Token from '../utility/token/jwt'


export interface UserControllerInterface {
    RegisterUser(req:Express.Request,res:Express.Response):Promise<Express.Response>
    RegisterRider(req:Express.Request,res:Express.Response):Promise<Express.Response>
    GetProfile(req:Express.Request,res:Express.Response):Promise<Express.Response>
    Login(req:Express.Request, res:Express.Response):Promise<Express.Response>
}


class UserController implements UserControllerInterface {
    public async RegisterUser(req:Express.Request,res:Express.Response):Promise<Express.Response> {
        if(req.method!=='POST'){
            return res.status(403).json({error:"invalid method"})
        }

        if(!req.body || req.body?.length===0){
            return res.status(300).json({error:"invalid request body"})
        }

        try {
            const bcrypt:Bcrypt = new Bcrypt()
            const hashed_password = await bcrypt.HashPassword(req.body.password)
            const user:User = {
                email: req.body.email,
                password_hash: hashed_password,
                name: req.body.name,
                phone: req.body.phone,
                role: Role.User
            }

            const saved_user = await DB.saveUser(user)
            return res.status(200).json({user:saved_user})
        }
        catch(err){
            return res.status(500).json({error:(err as Error).message})
        }
    }

    public async RegisterRider(req:Express.Request,res:Express.Response):Promise<Express.Response>  {
        if(req.method!=='POST'){
            return res.status(403).json({error:"invalid method"})
        }

        if(!req.body || req.body?.length===0){
            return res.status(300).json({error:"invalid request body"})
        }

        try {
            const bcrypt:Bcrypt = new Bcrypt()
            const hashed_password = await bcrypt.HashPassword(req.body.password)
            const user:User = {
                email: req.body.email,
                password_hash: hashed_password,
                name: req.body.name,
                phone: req.body.phone,
                role: Role.Rider
            }

            const saved_user = await DB.saveUser(user)
            return res.status(200).json({user:saved_user})
        }
        catch(err){
            return res.status(500).json({error:(err as Error).message})
        }
    }

    public async Login(req:Express.Request, res:Express.Response):Promise<Express.Response> {
        if(req.method!=="POST"){
            return res.status(400).json({error:"invalid method"})
        }

        if(!req.body || req.body?.length===0) {
            return res.status(400).json({error:"invalid request body"})
        }

        try {
            const user = await DB.findByEmail(req.body.email);
            const bcrypt = new Bcrypt()
            const ok = await bcrypt.ComparePassword(user.password_hash,req.body.password)
            if(!ok){
                throw new Error("incorrect credentials")
            }
            const token = await Token.Sign(user)
            return res.status(200).json({token:token})
        }
        catch(err) {
            return res.status(500).json({error:(err as Error).message})
        }
    }

    public async GetProfile(req:Express.Request, res:Express.Response):Promise<Express.Response> {
         if(req.method!=='GET'){
            return res.status(403).json({error:"invalid method"})
        }

        try {
            const { id } = req.query
            if(id){
                const user_id:bigint = BigInt(id as string)
                try {
                    const user:User = await DB.findByID(user_id)
                    return res.status(200).json({user:user})
                }
                catch(err){
                    const msg = (err as Error).message
                    return res.status(500).json({error:msg})
                }
            }
            else return res.status(302).json({error:"no id provided"})
        }
        catch(err){

            return res.status(500).json({error:err})
        }
    }


}

export default UserController;