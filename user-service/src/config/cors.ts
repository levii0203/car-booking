import cors from 'cors'

interface CorsInterface {
    config: cors.CorsOptions
    NewCors():any
}

class Cors implements CorsInterface {
    config: cors.CorsOptions

    constructor(config: cors.CorsOptions) {
        if(cors.length==0) {
            this.config = {
                origin: (origin,callback)=>{
                    const allowedOrigins = [
                        '*'
                    ]
                    if(!origin || allowedOrigins.indexOf(origin)!==-1){
                        callback(null,true)
                    }
                    else{
                        callback(new Error("Cors not allowed"),false)
                    }
                },
                methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'User-Agent'
                ],
                exposedHeaders: [
                    'X-Content-Range',
                    'Content-Range',
                    'X-Forwarded-For'
                ],
                credentials: true,
                preflightContinue: false,
                maxAge: 600

            }
        }
        this.config = config;
    }

    public NewCors(): any {
        return cors(this.config)
    }
}

export default Cors