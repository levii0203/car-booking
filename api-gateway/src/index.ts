import Routes from "./routes";
import ApiGatewayConfig from "./config/Api-gateway";
import ApiGateway ,{ApiGatewayInterface} from "./gateway";

const GatewayConfig:ApiGatewayConfig = {
    routes: Routes,
    port:"5000"
}

const Gateway:ApiGatewayInterface = new ApiGateway(GatewayConfig)
Gateway.Initialize()

Gateway.Listen()