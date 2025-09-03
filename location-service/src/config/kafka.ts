import { KafkaConfig } from "kafkajs";

const KafkaOpts:KafkaConfig = {
    clientId:"location-service",
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`|| "kafka:9092"],
    connectionTimeout: 30_000,
    requestTimeout: 60_000,
    retry: {
        retries: 5,
        initialRetryTime: 3000,
    },
};

export default KafkaOpts;