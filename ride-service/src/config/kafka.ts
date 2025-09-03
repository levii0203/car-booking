import {KafkaClientOptions} from "kafka-node"

const  KafkaOpts:KafkaClientOptions = {
    kafkaHost: `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`|| "localhost:9092",
    connectTimeout:10000,
    requestTimeout: 15000,
    autoConnect:true,
    idleConnection: 30000,
    connectRetryOptions: {
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 15000
    }
}

export default KafkaOpts;