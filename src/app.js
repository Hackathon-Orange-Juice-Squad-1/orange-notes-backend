require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const userRoute = require('./routes/User')
const MONGO_URL = process.env.MONGO_URL

app.use(
    express.urlencoded({
        extended:true,
    }),
)

app.use(express.json()) //

// Routes
app.use('/auth', userRoute)


// Conexão com o bando de dados
mongoose
    .connect(
        MONGO_URL
    )
    //função anônima
    .then(() =>{
        console.log('Conectamos')
        app.listen(3000)
    })
    .catch((err) => console.log(err))