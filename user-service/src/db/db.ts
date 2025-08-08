import { Pool, QueryResult} from "pg"
import User from "../models/User"

export interface DatabaseInterface {
    connect(): Promise<void>
    saveUser(obj:User): Promise<User>
    findByID(obj:bigint):Promise<User>
    findByEmail(obj:string):Promise<User>
}

class Database implements DatabaseInterface {
    private instance: Pool

    constructor() {
        this.instance = new Pool({
            host: process.env.POSTGRES_HOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            port: parseInt(process.env.POSTGRES_PORT || "5432"),
            idleTimeoutMillis: 30000,
        })
    }

    public async connect(): Promise<void> {
        try {
            await this.instance.connect()
            console.log("Connected to database successfully!")
            await this.instance.query(`
                CREATE TABLE IF NOT Users (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
                    role ENUM('rider', 'driver') NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    phone VARCHAR(20) UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_role (role), -- For queries filtering by role
                    INDEX idx_email (email) -- For fast email lookups
                );

                CREATE TABLE vehicles (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    driver_id BIGINT NOT NULL,
                    make VARCHAR(50) NOT NULL, -- e.g., Toyota
                    model VARCHAR(50) NOT NULL, -- e.g., Camry
                    license_plate VARCHAR(20) UNIQUE NOT NULL,
                    vehicle_type ENUM('sedan', 'suv', 'luxury') NOT NULL,
                    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE preferences (
                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    preferred_payment_method ENUM('card', 'cash', 'wallet') DEFAULT 'card',
                    preferred_ride_type ENUM('economy', 'premium', 'shared') DEFAULT 'economy',
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

            `)
        } catch (err) {
            console.error("Failed to connect to database:", err)
            process.exit(1)
        }
    }

    public async saveUser(obj:User): Promise<User> {
        return new Promise<User>((resolve,reject)=>{
            this.instance.query(`INSERT INTO Users(id,email,password_hash,role,name,phone) 
            VALUES($1,$2,$3,$4,%5,$6})`,[obj.id,obj.email,obj.password_hash,obj.role,obj.phone],(err,res:QueryResult<User>)=>{
                if(err){
                    reject(new Error("something went wrong"))
                    return;
                }
                resolve(res.rows[0] as User)
            })
        })
    }

    public async findByID(obj:bigint):Promise<User> {
        return new Promise<User>((resolve,reject)=>{
            this.instance.query(`SELECT * FROM Users WHERE id=$1`,[obj],(err,res:QueryResult<User>)=>{
                if(err){
                    reject(new Error("something went wrong"))
                    return;
                }
                if(!res.rowCount){
                    reject(new Error("user doesn't exist"))
                    return;
                }
                resolve(res.rows[0] as User)
            })
        })
    }

    public async findByEmail(obj:string):Promise<User>{
        return new Promise<User>((resolve,reject)=>{
            this.instance.query(`SELECT * FROM Users WHERE email=$1`,[obj],(err,res:QueryResult<User>)=>{
                if(err){
                    reject(new Error("something went wrong"))
                    return;
                }
                if(!res.rowCount){
                    reject(new Error("user doesn't exist"))
                    return;
                }
                resolve(res.rows[0] as User)
            })
        })
    }
}

export default Database;
