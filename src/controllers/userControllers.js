require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

class UserController {
  async cadastro(req, res) {
    const {
      first_name, last_name, email, password, confirmpassword,
    } = req.body;
    if (!first_name) return res.status(422).json({ msg: 'O nome é obrigatório!' });
    if (!last_name) return res.status(422).json({ msg: 'O sobrenome é obrigatório!' });
    if (!email) return res.status(422).json({ msg: 'O email é obrigatório!' });
    if (!password) return res.status(422).json({ msg: 'A senha é obrigatória!' });
    if (typeof password !== 'string') return res.status(422).json({ msg: 'Sua senha precisa ser uma string' });
    if (password !== confirmpassword) return res.status(422).json({ msg: 'As senhas não conferem!' });
    if (password.length <= 6) return res.status(422).json({ msg: 'A senha precisa ter no mínimo de 7 digitos!' });
    // checagem de email existente
    const UserExists = await User.findOne({ email });
    if (UserExists) return res.status(422).json({ msg: 'Por favor, utilize outro email.' });
    // criptografia da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    // criação do usuário

    const user = new User({
      first_name, last_name, email, password: passwordHash,
    });

    try {
      await user.save();
      const { secret } = process.env;
      const token = jwt.sign({ id: user._id }, secret);
      return res.status(201).json({ msg: 'Usuário criado com sucesso!', token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(422).json({ msg: 'O email é obrigatório!' });
    if (!password) return res.status(422).json({ msg: 'A senha é obrigatória!' });

    const UserExists = await User.findOne({ email });
    if (!UserExists) return res.status(404).json({ msg: 'Usuário ou senha inválidas!' });

    const checkPassword = await bcrypt.compare(password, UserExists.password);
    if (!checkPassword) return res.status(422).json({ msg: 'Usuário ou senha inválidas!' });

    try {
      const { secret } = process.env;
      const token = jwt.sign({ id: UserExists._id }, secret);
      return res.status(200).json({ msg: 'Autenticação realizada com sucesso.', token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!', error });
    }
  }

  async mudarFotoPerfil(req, res) {
    const {
      originalname: name, size, key, location: url = '',
    } = req.file;
    const { id } = req.params;
    if (!id) return res.status(422).json({ msg: 'Usuário não encontrado' });

    const user = await User.findById(id, '-password');

    try {
      user.profilePicture = {
        name, size, key, url,
      };
      user.save();
      return res.status(200).json(user.profilePicture);
    } catch (erro) {
      console.log(erro);
      return res.status(500).send(erro);
    }
  }

  async excluirPerfil(req, res) {
    const { id } = req.params;
    if (!id) return res.status(422).json({ msg: 'Usuário não encontrado!' });

    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ msg: 'Usuário excluído com sucesso.' });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async loginGoogle(req, res) {
    const {
      email, displayName, uid, photoURL,
    } = req.body;
    const user = User.findOne({ email });

    if (!user) {
      const palavras = displayName.split(' '); // Separando o displayName para salvar no banco de dados
      const first_name = palavras[0];
      const last_name = palavras.slice(1).join(' ');
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(uid, salt);
      const novoUser = new User({
        first_name, last_name, email, password: passwordHash, profilePicture: { url: photoURL },
      });
      try {
        await novoUser.save();
        const { secret } = process.env;
        const token = jwt.sign({ id: novoUser._id }, secret);
        return res.status(201).json({ msg: 'Usuário criado com sucesso!', token });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!' });
      }
    } else {
      const checkPassword = await bcrypt.compare(uid, user.password);
      if (!checkPassword) return res.status(422).json({ msg: 'Usuário ou senha inválidas!' });
      try {
        const { secret } = process.env;
        const token = jwt.sign({ id: user._id }, secret);
        return res.status(200).json({ msg: 'Autenticação realizada com sucesso.', token });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!', error });
      }
    }
  }
}

module.exports = UserController;
