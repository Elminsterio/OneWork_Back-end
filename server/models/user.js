const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'RECRUITER_ROLE', 'WORKER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({

    creationDate: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Enter the name is mandatory']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Enter the email is mandatory']
    },
    password: {
        type: String,
        required: [true, 'Enter a password is mandatory']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'WORKER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    }
});

// Para eliminar el password cuando se envíen datos.

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} should be unique' } )

module.exports = mongoose.model('User', userSchema);