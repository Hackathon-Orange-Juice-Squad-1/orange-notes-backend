const express = require("express")
const router = express.Router()
const User = require('../models/UserModel')
const UserController = require('../controllers/userControllers')

const userController = new UserController


router.get("/user/:id", async(req,res) => {

    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg:'Usuário não encontrado'})
    }

    res.status(200).json({user})
})


router.post('/register', userController.cadastro)

router.post("/login", userController.login)

module.exports = router