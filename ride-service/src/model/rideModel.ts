export enum RideStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum VehicleType {
    SEDAN = "sedan",
    SUV = "suv",
    LUXURY = "luxury",
    BIKE = "bike",
    AUTO = "auto"
}

export default interface Ride {
    ID?: BigInteger,
    user_id: string,
    driver_id?: string,
    start_location: string,
    end_location: string,
    distance: number,
    fare: number,
    vehicle_type:  VehicleType,
    status?: RideStatus,
    created_at?: Date,
    updated_at?: Date
}