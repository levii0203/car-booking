export default interface Location {
    user_id: BigInteger,
    latitude: number,
    longitude: number,
    created_at?: number
}

export interface LocationRedis {
    latitude: number,
    longitude: number,
    created_at: number
}