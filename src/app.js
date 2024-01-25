require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const userRoute = require('./routes/userRoutes')
const MONGO_URL = process.env.MONGO_URL

app.use(express.urlencoded({extended:true}))
app.use(express.json()) //

// Routes
app.use('/', userRoute)

// Conexão com o bando de dados
mongoose.connect(MONGO_URL).then(() =>{
        console.log('Conectado ao BD com sucesso! http://localhost:3000')
        app.listen(3000)
    }).catch((err) => console.log(err))