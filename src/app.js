require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const User = require('./modelos/User')

app.use(
    express.urlencoded({
        extended:true,
    }),
)

app.use(express.json())

//POST:

app.post('/auth/register', async (req, res) => {

    const {
        first_name, last_name, email, password, confirmpassword
    } = req.body
    if(!first_name) {
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }
    if(!last_name){
        return res.status(422).json({msg: 'O sobrenome é obrigatório!'})
        }
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
        }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória!'})
        }
    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }
    if(!password.length <= 6){
        return res.status(422).json({msg: 'A senha precisa ter no mínimo de 7 digitos!'})
        }

    // checagem de email existente
    const UserExists = await User.findOne({email:email})

    if(UserExists){
        return res.status(422).json({msg: 'Por favor, utilize outro email.'})
    }

    //criptografia da senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //criação do usuário
    const user = new User({
        first_name,
        last_name,
        email,
        password: passwordHash
    })

    try{

        await user.save()

        res.status(201).json({msg: 'Usuário criado com sucesso!'})

    }catch(error){
        console.log(error)

        res
        .status(500)
        .json({
            msg:'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!'
        })
    }
})

app.get('/', (req, res) =>{

    res.json({message: ''})

})

const MONGO_URL = process.env.MONGO_URL

// faz a url ficar oculta
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