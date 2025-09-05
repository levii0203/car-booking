import KafkaService from "./kafka"

const KafkaClient = new KafkaService()
KafkaClient.InitializeConsumer()
KafkaClient.InitializeProducer()

export default KafkaClient