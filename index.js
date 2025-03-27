const {initialiseDatabase}=require("./databse/database.connection")
const cors=require("cors")
const PORT=3000
const express=require('express')
const app=express()
app.use(express.json())
const corsOptions={
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))
initialiseDatabase()

