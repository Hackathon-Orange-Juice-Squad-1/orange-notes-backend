const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URL

async function conectaBancoDeDados() { 
    try {

        console.log('Conexão com o banco de dados iniciou')
        await mongoose.connect(url) 
        console.log('Conexão com o banco de dados feita com sucesso!') 

    } catch (erro) {
        console.log(erro)
    }
}

module.exports = conectaBancoDeDados