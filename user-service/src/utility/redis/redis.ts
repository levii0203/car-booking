import { createClient, RedisClientOptions } from 'redis'

const Options:RedisClientOptions = {
    url:`redis://${"localhost"}:${"6379"}/${0}`,
    socket: {
        reconnectStrategy: (retries: number) => {
          return Math.min(retries * 100, 3000);
        },
      },
}

export class RedisClient {
    private readonly client

    constructor(){
        this.client = createClient(Options)
        this.setupEventListeners()
    }

    public async connect(){
        try {
            await this.client.connect();
        }
        catch(err){
            throw new Error(`Failed to connect to redis: ${(err as Error).message}`);
        }
    }

    private setupEventListeners(): void {
        this.client.on('connect', () => {
        console.log('Redis client connected');
        });

        this.client.on('error', (err) => {
            throw new Error(`redis_client_error:${err}`);
        });

        this.client.on('end', () => {
        console.log('Redis client connection closed');
    });
  }
}

const redisClient = new RedisClient()

export default redisClient