const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const UserController = require('../controllers/userControllers')
const ProjetoController = require('../controllers/projetoController')
const multer = require('multer')
const multerConfig = require('../config/multer')


const userController = new UserController
const projetoController = new ProjetoController

router.get('/', (req, res) => {res.send('API SQUAD1 ORANGE >> ONLINE!')})


// PROJETOS

router.delete("projetos/:id", async (req, res) => {

})

router.get("/projetos/all", projetoController.mostrarTodosProjetos)
router.get("/projetos/:id", projetoController.mostrarProjeto) //Retorna projetos do usuário pro front
router.post("/projetos/:id", multer(multerConfig).single('file'), projetoController.cadastrarProjeto)

// AUTH 

router.post('/auth/register', userController.cadastro)
router.post("/auth/login", userController.login)

module.exports = router