import express from "express";
import Cors from "./config/cors";
import RideRouter from "./middleware/rideRoute";

const app = express()

const cors = new Cors({});

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
app.use(cors.NewCors())

app.use("/api/v1", RideRouter);

app.listen(8080, () => {
    console.log("ride service is running on port:3000")
})