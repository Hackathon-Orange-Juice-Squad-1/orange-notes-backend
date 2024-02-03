const User = require('../models/UserModel');

class ProjetoController {
  async cadastrarProjeto(req, res) {
    const {
      originalname: name, size, key, location: url = '',
    } = req.file;

    const { id } = req.params;
    const {
      title, tags, link, desc,
    } = req.body;

    if (!id || !title || !tags || !link || !desc) return res.status(422).json({ msg: 'Todos os campos são obrigatórios!'});

    const user = await User.findById(id, '-password');
    const userName = `${user.first_name} ${user.last_name}`;
    const projeto = {
      title,
      tags,
      link,
      desc,
      userName,
      image: {
        name, size, key, url,
      },
    };

    try {
      user.projetos.unshift(projeto);
      user.save();
      return res.status(201).json({ projeto });
    } catch (error) {
      return res.send(error);
    }
  }

  async mostrarProjeto(req, res) {
    const { id } = req.params;
    const user = await User.findById(id, '-password');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    return res.status(200).json(user.projetos);
  }

  async mostrarTodosProjetos(req, res) {
    const usuarios = await User.find({}, 'projetos');
    const todosProjetos = usuarios.reduce((projetos, usuario) => projetos.concat(usuario.projetos), []);
    return res.status(200).json(todosProjetos);
  }

  async atualizarProjeto(req, res) {
    const { file } = req;
    const { idUser } = req.params;
    const { idProjeto } = req.params;
    const {
      title, tags, link, desc,
    } = req.body;

    if (!idUser) return res.status(422).json({ msg: 'Usuário não encontrado' });

    const user = await User.findById(idUser, '-password');
    const indiceProjeto = user.projetos.findIndex((projeto) => projeto._id.toString() === idProjeto);

    if (indiceProjeto !== -1) {
      // Atualizar apenas os campos presentes no objeto enviado pelo usuário
      if (title) user.projetos[indiceProjeto].title = title;
      if (tags) user.projetos[indiceProjeto].tags = tags;
      if (link) user.projetos[indiceProjeto].link = link;
      if (desc) user.projetos[indiceProjeto].desc = desc;
      if (file && file.originalname && file.size && file.key) {
        user.projetos[indiceProjeto].image = {
          originalname: file.originalname,
          size: file.size,
          key: file.key,
          url: file.location || '',
        };
      }

      // Atualizando dia e mês
      const now = new Date();
      const dia = now.getDate().toString().padStart(2, '0'); // Garante que tenha dois dígitos
      const mes = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses são de 0 a 11
      user.projetos[indiceProjeto].dataAtualizacao = `${dia}/${mes}`;

      await user.save();
      return res.json(user.projetos[indiceProjeto]);
    } return res.status(404).json({ msg: 'Projeto não encontrado' });
  }

  async deletarProjeto(req, res) {
    const { idUser, idProjeto } = req.params;
    const user = await User.findById(idUser);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    const indiceProjeto = user.projetos.findIndex((projeto) => projeto._id.toString() === idProjeto);

    try {
      if (indiceProjeto !== -1) {
        user.projetos.splice(indiceProjeto, 1);
        await user.save();
      }
      return res.status(201).json({ msg: 'Projeto excluido com sucesso' });
    } catch (error) {
      return res.send(error);
    }
  }
}

module.exports = ProjetoController;
