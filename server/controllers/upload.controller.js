const { validationResult } = require('express-validator');
const uploadService = require('../services/upload.service');
const { responseOk, responseOkElementDeleted } = require('../utils/customResponses.util');
const logGenerator = require('../utils/logGenerator.util');

const fs = require('fs');
const path = require('path');

exports.modifyImg = async (req, res, next) => {
    const fileName = req.file.filename;
    const { id, type } = req.params;
    try {
        let user = await uploadService.modifyImg(fileName, id, type);
        responseOk(req, res, user);
    } catch(error) {
        next(error);
    }
}


exports.getImg = async (req, res, next) => {
    const id = req.params.id;

    try {
        const img = await uploadService.getImg(id);
        const pathFile = path.resolve(__dirname, `../../uploads/users/${ id }/${ img }`);
        logGenerator(req);
        if (fs.existsSync(pathFile) && img) {
            res.sendFile(pathFile);
        } else {
            let nofile = path.resolve(__dirname, `../assets/no_available.jpg`)
            res.sendFile(nofile);
        }
    } catch(error) {
        next(error);
    }
}

exports.deleteImg = async (req, res, next) => {
    const id = req.params.id;
    try {
        await uploadService.deleteImg(id);
        responseOkElementDeleted(req, res);
    } catch(error) {
        next(error);
    }
}

