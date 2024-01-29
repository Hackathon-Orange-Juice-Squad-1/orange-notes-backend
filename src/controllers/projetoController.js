const User = require('../models/UserModel');

class ProjetoController {
    async cadastrarProjeto(req,res) {
        const id = req.params.id
        const { title, tags, link, desc } = req.body
    
        if (!id) return res.status(422).json({ msg: 'Usuário não encontrado' });
        if (!title) return res.status(422).json({ msg: 'O título é obrigatório!' });
        if (!tags) return res.status(422).json({ msg: 'As tags são obrigatória!' });
        if (!link) return res.status(422).json({ msg: 'O link é obrigatório!' });
        if (!desc) return res.status(422).json({ msg: 'A descrição é obrigatório!' });
    
        const projeto = { title, tags, link, desc }
        const user = await User.findById(id, '-password')
    
        try {
            user.projetos.push(projeto)
            user.save()
            res.status(201).json({ msg: 'Projeto cadastrado com sucesso!' });
        } catch (err) {
            res.status(500).json({ msg: `Aconteceu um erro no servidor para cadastrar seu projeto: ${err}` });
        }
    }

    async mostrarProjeto(req, res) {
        const id = req.params.id
        const user = await User.findById(id, '-password')
        if (!user) return res.status(404).json({msg:'Usuário não encontrado'})
        else res.status(200).json(user.projetos)
    }
}



module.exports = ProjetoController