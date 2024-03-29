const mongoose = require('mongoose');

let validStatus = {
    // TODO: se ha hecho prueba técnica, se ha hablado con el equipo técnico, salario concretado
    values: ['backlog', 'ready', 'inProgress', 'videoSet', 'technicianChecked', 'accepted'],
    message: '{VALUE} is not a valid status'
}

let Schema = mongoose.Schema;

let offerSchema = new Schema({

    creationDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        required: [true, 'Enter salary is mandatory']
    },
    title: {
        type: String,
        required: [true, 'Enter job title is mandatory']
    },
    requirements: {
        type: String
    },
    workplaceAddress: {
        type: String
    },
    offerLink: {
        type: String
    },
    description: {
        type: String
    },
    videoCallLink: {
        type: String
    },
    videoCallDate: {
        type: Date
    },
    technicianChecked: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'backlog',
        enum: validStatus
    },
    abandoned: {
        type: Boolean,
        default: false
    },
    workerAssigned: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'worker'
    },
    recruiterAssigned: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'recruiter',
        required: true
    }
});

module.exports = mongoose.model('offer', offerSchema);

