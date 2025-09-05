import {WebSocketServer} from "ws";
import WssConfig from '../config/wss';
import { TopicMessage } from "../utility/kafka/kafka";
import KafkaClientService from "../workers/kafkaClient"
import { LocationRedis } from "../models/location";
import { SaveLocationToRedis } from "../utility/redis/redis";

class WebSocketService {
    private wss:WebSocketServer;

    constructor(){
        this.wss =  new WebSocketServer(WssConfig);
    }

    public Initialize():void {
        this.wss.on("error",(err)=>{
            throw err
        });
        this.wss.on("listening",()=>{
            console.log(`WebSocket server is listening on port ${WssConfig.port}`);
        });
        this.wss.on("connection",(ws)=>{
            ws.on("error",(err)=>{
                throw err
            })
            ws.on("message",async(message)=>{
                const res = JSON.parse(message.toString());
                if (res.type==="geometry"){
                    console.log(res)
                    const location:LocationRedis = {longitude: res.longitude, latitude: res.latitude, created_at:Date.now()}
                    await SaveLocationToRedis(res.user_id, location)
                    const topic_msg: TopicMessage = {key:res.user_id,value:JSON.stringify(location),headers:{}}
                    await KafkaClientService.ProduceLocationMessage(topic_msg)
                }
            })
        })
    }
}

export default WebSocketService;