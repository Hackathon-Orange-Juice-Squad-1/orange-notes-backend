const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const UserController = require('../controllers/userControllers')
const ProjetoController = require('../controllers/projetoController')

const userController = new UserController
const projetoController = new ProjetoController

router.get('/', (req, res) => {res.send('API SQUAD1 ORANGE >> ONLINE!')})


// PROJETOS

router.get("/projetos/:id", projetoController.mostrarProjeto) //Retorna projetos do usuário pro front
router.post("/projetos/:id", projetoController.cadastrarProjeto) //Cadastra projetos dos usuários




// AUTH

router.post('/auth/register', userController.cadastro)
router.post("/auth/login", userController.login)

module.exports = router