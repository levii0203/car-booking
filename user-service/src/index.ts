import express from 'express'
import Cors from './config/cors'
import VersionMiddleware from './middleware/version'
import DB from './db/db_client'
import UserRouter from './middleware/routes/user-route'
import redisClient from './utility/redis/redis'


const cors = new Cors({})
const app:express.Express = express()

//DB.connect()

const version = new VersionMiddleware("v1")

app.use(express.json())
app.use(cors.NewCors())
app.use(express.urlencoded({extended:true}))
app.use(version.VersionHandler())

app.use("/api/v1",UserRouter)


app.get("/api/v1", (req: express.Request, res: express.Response) => {
    res.status(200).json({ response: 'Getting on port:3000' })
})


app.listen(3000,()=>{
    console.log('Server is running on port: %d',3000)
})


