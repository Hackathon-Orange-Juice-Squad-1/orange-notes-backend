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

router.get("/projetos/:id", projetoController.mostrarProjeto) //Retorna projetos do usuário pro front
//router.post("/projetos/:id", projetoController.cadastrarProjeto) //Cadastra projetos dos usuários
router.post("/projetos/imagem/:id", multer(multerConfig).single('file'),async (req, res) => {
    const { originalname: name, size, key } = req.file  

    const id = req.params.id 
    const {title, tags, link, desc} = req.body

    if (!id) return res.status(422).json({ msg: 'Usuário não encontrado' });
    if (!title) return res.status(422).json({ msg: 'O título é obrigatório!' });
    if (!tags) return res.status(422).json({ msg: 'As tags são obrigatória!' });
    if (!link) return res.status(422).json({ msg: 'O link é obrigatório!' });
    if (!desc) return res.status(422).json({ msg: 'A descrição é obrigatório!' });

    const user = await User.findById(id, '-password')
    const projeto = {title, tags, link, desc, image: [name, size, key]}

    try{
        user.projetos.push(projeto) 
        user.save()
        return res.status(201).json({projeto})
    } catch(error){
        return res.send(error)
    }
})

// AUTH

router.post('/auth/register', userController.cadastro)
router.post("/auth/login", userController.login)

module.exports = router