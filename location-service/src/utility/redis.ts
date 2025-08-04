import {Redis, RedisOptions} from 'ioredis'
import {config} from 'dotenv'

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
    throw new Error(`REDIS_FAILED_FUNCTION: ${err as string}`)
})

RedisClient.on('close',(ch:string,msg:string)=>{
    console.log("redis closed")
})

export default RedisClient

