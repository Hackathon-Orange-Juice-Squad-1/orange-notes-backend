const User = require('../models/UserModel');

class ProjetoController {
    async cadastrarProjeto(req,res) {
        const { originalname: name, size, key, location: url = '' } = req.file
        
        console.log(req.body);
        
        const id = req.params.id 
        const {title, tags, link, desc} = req.body
        
        if (!id) return res.status(422).json({ msg: 'Usuário não encontrado' });
        if (!title) return res.status(422).json({ msg: 'O título é obrigatório!' });
        if (!tags) return res.status(422).json({ msg: 'As tags são obrigatória!' });
        if (!link) return res.status(422).json({ msg: 'O link é obrigatório!' });
        if (!desc) return res.status(422).json({ msg: 'A descrição é obrigatório!' });
        
        const user = await User.findById(id, '-password')
        const projeto = {title, tags, link, desc, image: {name, size, key, url}}
        
        try{
            user.projetos.unshift(projeto) 
            user.save()
            return res.status(201).json({projeto})
        } catch(error){
            return res.send(error)
        }
    }

    async mostrarProjeto(req, res) {
        const id = req.params.id
        const user = await User.findById(id, '-password')
        if (!user) return res.status(404).json({msg:'Usuário não encontrado'})
        else return res.status(200).json(user.projetos)
    }

    async mostrarTodosProjetos(req, res) {
        const usuarios = await User.find({}, 'projetos');
        const todosProjetos = usuarios.reduce((projetos, usuario) => {
            return projetos.concat(usuario.projetos);
        }, []);
        return res.status(200).json({todosProjetos})
    }
}



module.exports = ProjetoController