import kafka , { KafkaClient } from 'kafka-node';
import KafkaOpts from '../../config/kafka';

interface KafkaServiceInterface {
    InitializeProduce():Promise<void>
}

interface Topic {
    name: string;
    partitions: number;
    replicationFactor: number;
}

interface TopicMessage {
    topic: string;  
    messages: string;
    partition?: number; 
}

class KafkaService implements KafkaServiceInterface {
    private client: KafkaClient
    private producer: kafka.Producer | null
    private Topics: Topic[]
    
    constructor() {
        this.client = new KafkaClient(KafkaOpts);
        this.Topics = [
            {
                name: 'location',
                partitions: 1,
                replicationFactor: 1
            }
        ];
        this.producer = null;
    }

    public InitializeProduce():Promise<void> {
        return new Promise((resolve,reject)=>{
            this.producer = new kafka.Producer(this.client);
            this.producer.on('ready', () => {
                console.log("Kafka producer is ready");
                resolve();
            });
            this.producer.on('error', (err) => {
                console.error("Kafka producer error:", err);
                reject(err);
            });

            const topics: kafka.CreateTopicRequest[] =  this.Topics.map(topic => {
                return {
                    topic: topic.name,
                    partitions: topic.partitions,
                    replicationFactor: topic.replicationFactor
                };
            })

            this.client.createTopics(topics, (err, result) => {
                if (err) {
                    console.error("Failed to create topics:", err);
                    return reject(err);
                }
                console.log("Topics created successfully:", result);
            });
        })
    }

    public ProduceLocationMessage(location: TopicMessage): Promise<void> {
        return new Promise((resolve,reject)=>{
            if (!this.producer){
                return reject(new Error("Producer is not initialized"));
            }

            const payload: kafka.ProduceRequest[] = [
                {
                    topic: location.topic,
                    messages: location.messages,
                    partition: 0
                }
            ];

            this.producer.send(payload, (err,_)=>{
                if(err){
                    console.error("Failed to send message:", err);
                    return reject(err)
                }

                console.log("Message sent successfully");
                resolve()
            })
        })
    }
}


export default KafkaService;
