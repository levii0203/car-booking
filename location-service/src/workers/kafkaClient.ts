import { isMainThread } from 'node:worker_threads';
import KafkaService from "../utility/kafka/kafka";

/**
 * @global
 */
const KafkaClientService = new KafkaService();
if (isMainThread) {
    (async () => {
        try {
            await KafkaClientService.InitializeProducer();
            await KafkaClientService.InitializeConsumer();
        } catch (err) {
            console.error(`Initialization failed: ${(err as Error).message}`);
            process.exit(1);
        }
    })();
}

export default KafkaClientService;
