import express from 'express'
import Cors from './config/cors'
import WebSocketService from './ws/websocket'
import { Worker } from 'node:worker_threads'
import { config } from 'dotenv'

config()

const app:express.Express = express()

const cors = new Cors({});

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors.NewCors())

function InitializeKafkaWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
        const kafkaWorker = new Worker('./dist/workers/kafkaClient.js')

        kafkaWorker.on('message', (msg) => {
            console.log('Message from worker:', msg)
        })

        kafkaWorker.on('error', (err) => {
            reject(new Error('Kafka-worker error: ' + err.message))
        })

        kafkaWorker.on('exit', (code: number) => {
        if (code !== 0) {
            reject(new Error('Kafka-worker stopped with exit code ' + code))
        }
        })

        resolve()
    });
}

InitializeKafkaWorker()

const webSocket = new WebSocketService()
webSocket.Initialize()

app.listen(5000,()=>{
    console.log("location service is running on port:5000")
})