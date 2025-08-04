import express from 'express'

const app:express.Express = express()

app.use(express.json())


app.listen(5000,()=>{
    console.log("location service is running on port:5000")
})