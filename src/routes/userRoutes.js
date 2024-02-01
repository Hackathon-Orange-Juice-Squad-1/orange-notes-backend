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



router.put("/user/foto/:id", multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = '' } = req.file
    const id = req.params.id 
    if (!id) return res.status(422).json({ msg: 'Usuário não encontrado' });

    const user = await User.findById(id, '-password')

    try {
        user.profilePicture = { name, size, key, url }
        user.save()
        res.status(200).json(user.profilePicture)
    } catch (erro) {
        console.log(erro)
        return res.status(500).send(erro);
    }

})
// PROJETOS

router.get("/projetos/all", projetoController.mostrarTodosProjetos)
router.get("/projetos/:id", projetoController.mostrarProjeto) //Retorna projetos do usuário pro front
router.post("/projetos/:id", multer(multerConfig).single('file'), projetoController.cadastrarProjeto)
router.delete("/projetos/:idUser/:idProjeto", projetoController.deletarProjeto)
router.put("/projetos/:idUser/:idProjeto", multer(multerConfig).single('file'), projetoController.atualizarProjeto)

// AUTH 

router.post('/auth/register', userController.cadastro)
router.post("/auth/login", userController.login)

module.exports = router