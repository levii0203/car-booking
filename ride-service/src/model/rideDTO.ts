import { VehicleType } from "./rideModel";
import { z } from "zod"

export const RideRequestSchema = z.object({
    user_id: z.string().nonoptional(),
    vehicle_type: z.enum(VehicleType).nonoptional(),
    destination_latitude: z.float64().nonnegative().nonoptional(),
    destination_longitude: z.float64().nonnegative().nonoptional()
})

export type RideRequestDTO = z.infer<typeof RideRequestSchema>