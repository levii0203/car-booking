import KafkaService from "./kafka";

const KafkaClientService = new KafkaService();
KafkaClientService.InitializeProducer();
KafkaClientService.InitializeConsumer()

export default KafkaClientService;
