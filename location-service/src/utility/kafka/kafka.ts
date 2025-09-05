import { Kafka , Producer, ITopicConfig, Admin, Consumer, Message, Partitioners } from 'kafkajs';
import KafkaOpts from '../../config/kafka';

interface KafkaServiceInterface {
    InitializeProducer():Promise<void>
    InitializeConsumer():Promise<void>
    ProduceLocationMessage(message:TopicMessage):Promise<void>
}
export interface TopicMessage {
    key: string,
    value: string,
    headers: any
}

/**
 * @class kafka Service
 * @implements {KafkaServiceInterface}
 */
class KafkaService implements KafkaServiceInterface {
    private client: Kafka
    private producer: Producer|null
    private consumer: Consumer|null
    private Topics: Array<ITopicConfig>
    private ConsumedTopics: Array<string|RegExp>
    
    constructor() {
        this.client = new Kafka(KafkaOpts)
        //topics to be produced
        this.Topics = [
            {
                topic: 'location', numPartitions: 1, replicationFactor: 1
            },
            {
                topic: 'nearby_driver', numPartitions: 1, replicationFactor: 1
            },
        ];
        //topics to be consumed
        this.ConsumedTopics = [
            "ride_requests"
        ]
        this.producer=null
        this.consumer=null
    }
    /**
     * 
     * @description initializes producer
     */
    public InitializeProducer():Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            if(!this.Topics){
                reject(new Error("topics can't be empty"))
            }

            //Admin
            const admin:Admin = this.client.admin()
            try {
                await admin.connect()
                const topics = await admin.listTopics();
                console.log("Existing topics:",topics);
                await admin.createTopics({
                    waitForLeaders: true,
                    topics: this.Topics
                })
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
            finally {
                await admin.disconnect()
            }
            try {
                this.producer = await this.client.producer({transactionTimeout: 30000, allowAutoTopicCreation:false, createPartitioner: Partitioners.LegacyPartitioner });
                await this.producer.connect()
                resolve()
            }
            catch(err){
                //this.closeProducer()
                reject(new Error((err as Error).message as string))
            }
            
        })
    }
    /**
     * 
     * @description initializes consumer
     */
    public InitializeConsumer():Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            if(!this.ConsumedTopics){
                reject(new Error("no topic to be consumed"))
            }

            try {
                this.consumer = await this.client.consumer({
                    groupId:'ride-process',
                    heartbeatInterval: 3000,      
                    sessionTimeout: 30000,       
                    allowAutoTopicCreation: false
                });
                await this.consumer.connect()
                //Subscribing the topics to be consumes
                for (const topic of this.ConsumedTopics) {
                    await this.consumer.subscribe({ topic, fromBeginning: false });
                }
                //Running the consumer
                await this.consumer.run({
                    eachBatchAutoResolve: true,
                    eachBatch: async({
                        batch,
                        resolveOffset,
                        heartbeat,
                        commitOffsetsIfNecessary,
                    }) => {
                        for(let msg of batch.messages){
                            console.log(msg.value)
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

    /**
     * 
     * @param Message
     * @description producing location message
     */
    public ProduceLocationMessage(msg: TopicMessage):Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            try {
                var Msg:Message = {
                    key:msg.key,
                    value:msg.value,
                    headers: msg.headers
                }
                console.log(Msg)
                await this.producer?.send({
                    topic:'location',
                    messages: [Msg],
                    acks: -1,
                    timeout: 30000,
                })
                resolve()
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
        })
    }

    /**
     * 
     * @param Message
     * @description dispatching driver message
     */
    public DispatchDriverMessage(msg:TopicMessage):Promise<void> {
        return new Promise(async(resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            try {
                var Msg:Message = {
                    key:msg.key,
                    value:msg.value,
                    headers: msg.headers
                }
                await this.producer?.send({
                    topic:'nearby_driver',
                    messages: [Msg],
                    acks: -1,
                    timeout: 30_000,
                })
                resolve()
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
        })
    }

    /**
     * @private
     * @description closes the producer
     */
    private closeProducer(): Promise<void> {
        return new Promise((resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            try {
                resolve(this.producer?.disconnect())
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
        })
    }

    /**
     * @private
     * @description closes the consumer
     */
    private closeConsumer(): Promise<void> {
        return new Promise((resolve,reject)=>{
            if(!this.client){
                reject(new Error("kafka-client not initialized"))
            }
            try {
                resolve(this.consumer?.disconnect())
            }
            catch(err){
                reject(new Error((err as Error).message as string))
            }
        })
    }
}

export default KafkaService;
