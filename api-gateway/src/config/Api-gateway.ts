import { CorsOptions } from "cors";
import Route from "./Route";

export default interface ApiGatewayConfig {
    routes:Array<Route>

    port: string

    cors?: CorsOptions
}

