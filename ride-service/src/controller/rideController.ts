import { Request , Response } from "express"
import DB from "../db/dbClient"
import { RideRequestDTO , RideRequestSchema } from "../model/rideDTO";
import KafkaClient from "../utility/kafka/kafkaClient";

export default class RideController {
    public async RideRequest(req:Request, res:Response):Promise<void> {
        try {
           const dto: RideRequestDTO = RideRequestSchema.parse(req.body);
           await KafkaClient.ProduceRideRequest({key:dto.user_id, value:JSON.stringify({
            vehicle_type:dto.vehicle_type, 
            destination_latitude:dto.destination_latitude,
            destination_longitude:dto.destination_longitude
        }), headers:{}})
           res.status(200).json({ message: "Ride request accepted"})
        }
        catch(err){
            console.log("[RideRequest] Error: ",(err as Error).message as string)
            res.status(500).json({error:"[RideRequest] internal server error"})
        }
    }
}