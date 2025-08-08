import pg , {Pool , QueryResult} from 'pg'
import DefaultConfig from "../config/dbConfig";
import Ride from '../model/rideModel';

/**
 * @interface 
 */
export interface RideDatabaseInterface {
    connect():Promise<void>
}

/**
 * @class RideDatabase
 * @implements {RideDatabaseInterface}
 * @description this class handles the database
 */
class RideDatabase implements RideDatabaseInterface {
    private instance: Pool

    constructor(){
        /**
         * default config for connection
         */
        this.instance = new Pool(DefaultConfig)
    }

    public async connect():Promise<void> {
        try {
            await this.instance.connect()
            console.log("Connected to ride database successfully!")
            /**
             * ride table schema
             */
            await this.instance.query(`
                CREATE TABLE IF NOT rides (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    driver_id BIGINT NOT NULL,
                    rider_id BIGINT NOT NULL,
                    start_location VARCHAR(255) NOT NULL,
                    end_location VARCHAR(255) NOT NULL,
                    distance FLOAT NOT NULL,
                    fare DECIMAL(10, 2) NOT NULL,
                    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `)
            .then(()=>{
                console.log("Ride database schema initialized successfully!")
            })
        }
        catch (err) {
            console.error("Failed to connect to the database:", (err as Error).message);
            throw err;
        }
    }

    public SaveRide(ride:Ride):Promise<Ride> {
        return new Promise<Ride>((resolve,reject)=>{
            this.instance.query(`
                INSERT INTO rides (driver_id, rider_id, start_location, end_location, distance, fare, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *    
            `, [ride.driver_id, ride.user_id, ride.start_location, ride.end_location, ride.distance, ride.fare, ride.status], 
            (err:Error, res: QueryResult) =>{
                if(!err.message){
                    reject(new Error("Failed to save ride: "+err.message))
                    return;
                }

                if(res.rows.length === 0) {
                    reject(new Error("No ride was saved"))
                    return;
                }

                resolve(res.rows[0] as Ride)
            })
        })
    }

    

}

export default RideDatabase;
