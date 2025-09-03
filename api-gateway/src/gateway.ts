import express from "express";
import {rateLimit} from "express-rate-limit";
import {createProxyMiddleware} from "http-proxy-middleware"
import ApiGatewayConfig from "./config/Api-gateway";
import { CorsOptions } from "cors";
import Cors from "./config/Cors";
import Route from "./config/Route";

/**@interface*/
export interface ApiGatewayInterface {
    // Initializes the ApiGateway
    Initialize(): void
    // Listens and serves on configured port
    Listen():void
}

/**
 * @class 
 * @description This is the basic implementation of ApiGateway in microservices
 */
export default class ApiGateway implements ApiGatewayInterface {
    private app:express.Express
    private cors: CorsOptions|null = null
    /**
     * Api Routes
     */
    private routes:Array<Route>
    /**/ 
    private port:string

    constructor(config: ApiGatewayConfig){
        this.app = express()
        this.routes = config.routes
        this.port = config.port
        this.cors = config.cors ?? null
    }

    /**__init__*/
    public Initialize(): void {
        // setting the cors
        if(!this.cors){
            const cors = new Cors({}) 
            this.app.use(cors.NewCors())
        }
        else {
            const cors = new Cors(this.cors) 
            this.app.use(cors.NewCors())
        }
        /**
         * Setting the proxies
         */
        this.routes.forEach((route)=>{
            if(route.rateLimit){
                 /** Setting the simple rate limiter as middleware */
                this.app.use(route.url as string, rateLimit(route.rateLimit),createProxyMiddleware(route.proxy))
            }
            else {
                this.app.use(route.url as string, createProxyMiddleware(route.proxy))
            }
        })
    }

    public Listen():void {
        this.app.listen(this.port, ()=>{
            console.log(`Api Gateway is running on ${this.port}`)
        })
    }
}
