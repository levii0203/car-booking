import { ServerOptions } from "ws";
import { config } from "dotenv";

config();

const DefaultWssConfig:ServerOptions = {
    port: parseInt(process.env.WSS_PORT ||"8000"),
    perMessageDeflate: false
}

export default DefaultWssConfig;