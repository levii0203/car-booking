import { KafkaConfig, logLevel } from "kafkajs";
import { config } from "dotenv";

config()

const KafkaOpts:KafkaConfig = {
    clientId:"location-service",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`|| "localhost:9092"],
    connectionTimeout: 30000,
    requestTimeout: 60000,
    retry: {
        retries: 5,
        initialRetryTime: 3000,
    },
};

export default KafkaOpts;