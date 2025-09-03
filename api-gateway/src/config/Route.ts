
export interface Proxy {
    target: string,
    changeOrigin: true,
    pathRewrite:any
}

export default interface Route {
    url: String,
    rateLimit?: {
        windowMs: number,
        max: number,
        statusCode: number
    },
    proxy: Proxy
}