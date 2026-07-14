const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/]

    },
    
    role:{
        type: String,
        default: 'user'
    }
    
})

module.exports = mongoose.model('User' , UserSchema);