import KafkaService from "./kafka";

const KafkaClientService = new KafkaService();
KafkaClientService.InitializeProduce();

export default KafkaClientService;
