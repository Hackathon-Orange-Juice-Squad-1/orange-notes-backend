require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');
const app = express();


const userRoute = require('./routes/userRoutes');
const { MONGO_URL } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/', userRoute);

// Conexão com o bando de dados
mongoose.connect(MONGO_URL).then(() => {
  console.log('Conectado ao BD com sucesso! http://localhost:3000');
  app.listen(3000);
}).catch((err) => console.log(err));
