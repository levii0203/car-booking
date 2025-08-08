import {WebSocketServer} from "ws";
import WssConfig from '../config/wss';

class WebSocketService {
    private wss:WebSocketServer;

    constructor(){
        this.wss =  new WebSocketServer(WssConfig);
    }

    public Initialize():void {
        this.wss.on("error",(err)=>{
            console.error("WebSocket error:", err);
        });
        this.wss.on("listening",()=>{
            console.log(`WebSocket server is listening on port ${WssConfig.port}`);
        });
        this.wss.on("connection",(ws)=>{
            ws.on("error",(err)=>{
                console.error("WebSocket error:", err);
            })
            ws.on("message",async(message)=>{
                const res = JSON.parse(message.toString());
                if (res.type==="geometry"){
                    console.log(res);
                }
            })
        })
    }
}

export default WebSocketService;