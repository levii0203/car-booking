export enum RideStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export default interface Ride {
    ID?: BigInteger,
    user_id: BigInteger,
    driver_id?: BigInteger,
    start_location: string,
    end_location: string,
    distance: number,
    fare: number,
    status?: RideStatus,
    created_at?: Date,
    updated_at?: Date
}