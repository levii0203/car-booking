import { Kafka, Consumer, Admin, ITopicConfig, Producer, Partitioners, Message } from "kafkajs";
import KafkaOpts from "../../config/kafka";

export interface KafkaServiceInterface {
    InitializeConsumer():Promise<void>
}

export interface TopicMessage {
    key: string,
    value: string,
    headers: any
}

export default class KafkaService implements KafkaServiceInterface {
    private client: Kafka
    private createdTopics: Array<ITopicConfig>
    private consumedTopics: Array<string>
    private consumer:Consumer|null
    private producer:Producer|null

    constructor(){
        this.client = new Kafka(KafkaOpts)
        this.createdTopics = [
            {
                topic:'ride_requests',numPartitions:1,replicationFactor:1
            }
        ]
        this.consumedTopics = [
            "location"
        ]
        this.consumer = null
        this.producer = null
    }

    public InitializeConsumer():Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }

            try {
                this.consumer = await this.client.consumer({
                    groupId:'location-process',
                    heartbeatInterval: 3000,      
                    sessionTimeout: 30000,   
                    rebalanceTimeout: 30000,    
                    allowAutoTopicCreation: false
                });
                await this.consumer?.connect()
                //Subscribing the topics to be consumes
                for (const topic of this.consumedTopics) {
                    await this.consumer.subscribe({ topic, fromBeginning: false });
                }
                //Running the consumer
                await this.consumer?.run({
                    eachBatchAutoResolve: true,
                    eachBatch: async({
                        batch,
                        resolveOffset,
                        heartbeat,
                        commitOffsetsIfNecessary,
                    }) => {
                        for(let msg of batch.messages){
                            console.log(msg)
                            resolveOffset(msg.offset)
                            heartbeat()
                        }
                        await commitOffsetsIfNecessary()
                    }
                })
                resolve()
            }
            catch(err){
                //this.closeConsumer()
                reject(new Error((err as Error).message as string))
            }

        })
    }

    public InitializeProducer():Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }

            const admin:Admin = this.client.admin()
            try {
                await admin.connect()
                await admin.createTopics({
                    waitForLeaders:true,
                    topics: this.createdTopics
                })
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
            finally {
                await admin.disconnect()
            }
            try {
                this.producer = await this.client.producer({ transactionTimeout: 30000, allowAutoTopicCreation:false, createPartitioner: Partitioners.LegacyPartitioner });
                await this.producer.connect()
                resolve()
            }
            catch(err){
                //this.closeProducer()
                reject(new Error((err as Error).message as string))
            }

        })
    }

    public ProduceRideRequest(message:TopicMessage):Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            if(!this.producer){
                reject(new Error("kafka-producer not initialized"))
            }

            try{
                const msg:Message = {
                    key: message.key,
                    value: message.value,
                    headers: message.headers
                }
                await this.producer?.send({
                    topic:'ride_requests',
                    messages: [msg],
                    acks: -1,
                    timeout: 30000

                })
                resolve()
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
            
        })
    }
}