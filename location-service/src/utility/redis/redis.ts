import {Redis, RedisOptions} from 'ioredis'
import {config} from 'dotenv'
import { LocationRedis } from '../../models/location'

config()

const clientOptions:RedisOptions = {
    host:process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD,
    db:0
}

const RedisClient = new Redis(clientOptions)

RedisClient.on('connect',()=>{
    console.log('Connected to Redis')
})

RedisClient.on('error',(ch:string,err:string)=>{
    console.log(`REDIS_FAILED_FUNCTION: ${err as string}`)
})

RedisClient.on('close',(ch:string,msg:string)=>{
    console.log("redis closed")
})

export async function SaveLocationToRedis(user_id:BigInteger,location:LocationRedis){
    try {
        await RedisClient.set(user_id.toString(),JSON.stringify(location))
        console.log("Successfully saved: " + location)
    }       
    catch(err){
       throw err instanceof Error ? err : new Error(String(err));
    }
}

export default RedisClient

