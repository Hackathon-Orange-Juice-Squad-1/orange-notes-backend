const mongoose = require('mongoose')

const User = mongoose.model('User',{
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true}
})

module.exports = User