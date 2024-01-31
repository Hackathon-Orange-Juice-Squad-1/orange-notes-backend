const mongoose = require('mongoose')

const projetoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    tags: { type: [String], default: [], required: true},
    link: {type: String, required: true},
    desc: {type: String, required: true},
    image: {
      name: {type: String},
      size: {type: Number},
      key: {type: String},
      url: {type: String},
    },
    dataCriacao: {
      type: String,
      default: () => {
        const now = new Date(); 
        const dia = now.getDate().toString().padStart(2, '0'); // Garante que tenha dois dígitos
        const mes = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses são de 0 a 11
        return `${dia}/${mes}`;
      },
    },
    dataAtualizacao: {
      type: String, 
      default: () => {
        const now = new Date();
        const dia = now.getDate().toString().padStart(2, '0'); // Garante que tenha dois dígitos
        const mes = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses são de 0 a 11
        return `${dia}/${mes}`;
      },
    },
  });

const User = mongoose.model('User',{
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: mongoose.Schema.Types.Mixed, required: true},
    projetos: [projetoSchema]
})

module.exports = User