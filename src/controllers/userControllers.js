require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const User = require('../models/UserModel');

class UserController {
  async cadastro(req, res) {
    const {
      first_name, last_name, email, password, confirmpassword,
    } = req.body;
    if (!first_name || !last_name || !email || !password || !confirmpassword) return res.status(422).json({ msg: 'Todos os campos, são obrigatórios!' });
    if (password !== confirmpassword) return res.status(400).json({ msg: 'As senhas não conferem!' });
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
      const decoded = jwtDecode(token);
      return res.status(201).json({ msg: 'Usuário criado com sucesso!', token, decoded });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'Aconteceu um erro no servidor, por favor, tente novamente mais tarde!' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.status(422).json({ msg: 'O email e a senha são obrigatórios!' });

    const UserExists = await User.findOne({ email });
    if (!UserExists) return res.status(404).json({ msg: 'Usuário ou senha inválidas!' });

    const checkPassword = await bcrypt.compare(password, UserExists.password);
    if (!checkPassword) return res.status(422).json({ msg: 'Usuário ou senha inválidas!' });

    try {
      const { secret } = process.env;
      const token = jwt.sign({ id: UserExists._id }, secret);
      const decoded = jwtDecode(token);
      return res.status(200).json({ msg: 'Autenticação realizada com sucesso.', token, decoded });
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
    const user = await User.findById(id, '-password');
    if (!user) return res.status(422).json({ msg: 'Usuário não encontrado' });

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
    if (!id) return res.status(422).json({ msg: 'Por favor, insira um ID válido!' });

    const UserExists = User.findOne({ id });
    if (!UserExists) return res.status(422).json({ msg: 'Usuário não encontrado.' });

    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ msg: 'Usuário excluído com sucesso.' });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async userInfo(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId, '-password');

      if (!user) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }

      return res.status(200).json({
        first_name: user.first_name,
        last_name: user.last_name,
        profilePicture: user.profilePicture,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro interno ao obter informações do usuário' });
    }
  }
}

module.exports = UserController;
