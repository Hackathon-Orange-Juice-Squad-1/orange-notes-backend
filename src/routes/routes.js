const express = require('express');

const router = express.Router();
const multer = require('multer');
const User = require('../models/UserModel');
const UserController = require('../controllers/userControllers');
const ProjetoController = require('../controllers/projetoController');
const multerConfig = require('../config/multer');

const userController = new UserController();
const projetoController = new ProjetoController();

router.get('/', (req, res) => { 
  res.send('<h2>API SQUAD1 ORANGE >> ONLINE!</h2><a href="https://github.com/Hackathon-Orange-Juice-Squad-1/orange-notes-backend">Nosso Github </a>'); 
});

router.put('/user/foto/:id', multer(multerConfig).single('file'), userController.mudarFotoPerfil);
// PROJETOS

router.get('/projetos/all', projetoController.mostrarTodosProjetos);
router.get('/projetos/:id', projetoController.mostrarProjeto); // Retorna projetos do usuário pro front
router.post('/projetos/:id', multer(multerConfig).single('file'), projetoController.cadastrarProjeto);
router.delete('/projetos/:idUser/:idProjeto', projetoController.deletarProjeto);
router.put('/projetos/:idUser/:idProjeto', multer(multerConfig).single('file'), projetoController.atualizarProjeto);

// AUTH

router.post('/auth/register', userController.cadastro);
router.post('/auth/login', userController.login);

module.exports = router;
