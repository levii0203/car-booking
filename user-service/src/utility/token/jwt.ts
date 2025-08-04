import {  JwtPayload, sign , SignOptions, verify  } from "jsonwebtoken";
import User from "../../models/User";

export class Jwt {
    secret_key:string 

    constructor(key:string){
        this.secret_key = key
    }
    public async Sign(payload:User):Promise<string> {
        try {
            const opts: SignOptions = {
                algorithm: 'RS256',
                expiresIn: 60*1000
            }
            const token = await sign(JSON.stringify(payload),this.secret_key,opts)
            return token
        }
        catch(err){
            throw err
        }
    }

    public async Verify(token:string){
        try {
            const user:string|JwtPayload = await verify(token,this.secret_key)
            return user as User
        }
        catch(err){
            throw err
        }
    }
}

const Token = new Jwt("oxygen")

export default Token;