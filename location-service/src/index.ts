import express from 'express'
import Cors from './config/cors'
import WebSocketService from './ws/websocket'

const app:express.Express = express()

const cors = new Cors({});

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors.NewCors())

const wsService = new WebSocketService();
wsService.Initialize();

app.listen(5000,()=>{
    console.log("location service is running on port:5000")
})