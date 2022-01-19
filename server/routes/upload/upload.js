const express = require('express');
const fileUpload = require('express-fileupload');

const User = require('../../models/user');

const verifyToken = require('../../middlewares/veryfyAuth');
const { verifyOwnId } = require('../../middlewares/verifyRole');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());

app.put('/upload/:type/:id', [verifyToken, verifyOwnId], function(req, res) {

    console.log(req.files);

    let type = req.params.type;
    let id = req.params.id;
    

    // Valida si se ha introducido algún archivo.

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'There are no files in the request'
                    }
        })
    }

    // Se valida si el tipo introducido en el PATH es válido.

    if (type !== 'user') {
        return res.status(400)
                      .json({
                          ok: false,
                          err: {
                              message: 'The valid type of the request is user'
                          }
                      })
        }

    let file = req.files.file;
    let fileCut = file.name.split('.');
    let fileExtension = fileCut[fileCut.length - 1];
    
    console.log(fileExtension);

    let fileName;

    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    // Se valida si la extensión del archivo es válida.

        if (!validExtensions.some((ext) => ext == fileExtension)) {
            return res.status(400)
                          .json({
                              ok: false,
                              err: {
                                  message: 'The valid types of file are: ' + validExtensions.join(', ')
                              }
                          })
            }
        
        // Se crea el folder.
        
        if (!fs.existsSync(path.resolve(__dirname, `../../../uploads/${type}/${id}`))) {
    
            fs.mkdirSync(path.resolve(__dirname, `../../../uploads/${type}/${id}`));
        }

        // Cambia nombre del archivo.

        fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

        // Mueve el archivo a la ubicación seleccionada

        file.mv(path.resolve(__dirname, `../../../uploads/${type}/${id}/${fileName}`), (err) => {
    
            if(err) {
                return res.status(500)
                          .json({
                              ok: false,
                              err
                          })
            }
        })

        userImg(id, res, type, fileName)

});

app.get('/file/:type/:id/:name', [verifyToken, verifyOwnId], (req, res) => {

    let name = req.params.name;
    
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {

        res.sendFile(pathFile)

    } else {

        let nofile = path.resolve(__dirname, `../../assets/no_available.jpg`)
        res.sendFile(nofile)

    }


})

app.delete('/file/:type/:id/:name', [verifyToken, verifyOwnId], (req, res) => {

    let name = req.params.name;
    
    let type = req.params.type;
    let id = req.params.id;

    let pathFile = path.resolve(__dirname, `../../../uploads/${type}/${ id }/${ name }`);
    
    if (fs.existsSync(pathFile)) {

        User.findById(id, (err, UserDB) => {
        
            if(!UserDB) {  
                return res.status(400)
                          .json({
                              ok: false,
                              err: {
                                  message: 'This user doesn\'t exist'
                            }
                        })
                }
    
            if(err) {
                return res.status(500)
                          .json({
                                ok: false,
                                 err
                            })
                }
                
            deleteFile(id, type, UserDB.img);
            deleteFolder(id, type);
            UserDB.img = undefined;
            
            UserDB.save((err2, UserDBsaved) => {
                if(err2) {
                    return res.status(500)
                              .json({
                                    ok: false,
                                     err2
                                })
                    }

                res.json({
                    ok: true,
                    UserDBsaved,
                    message: 'The photo was successfully deleted'
                })
            })
        })
    } else {
        return res.json({
            ok: true,
            message: 'The photo was successfully deleted'
        })
    }
})


function userImg(id, res, type, fileName) {

    User.findById(id, (err, UserDB) => {
        
        if(!UserDB) {

            deleteFolder(id, type);

            return res.status(400)
                      .json({
                          ok: false,
                          err: {
                              message: 'This user doesn\'t exist'
                          }
                      })
            }

        if(err) {

            deleteFolder(id, type);

            return res.status(500)
                      .json({
                            ok: false,
                             err
                        })
            }
            
        deleteFile(id, type, UserDB.img);

        UserDB.img = fileName;
        
        UserDB.save((err2, UserDBsaved) => {

            res.json({
                ok: true,
                user: UserDBsaved
                })
        })
    })
}

function deleteFile(id, type, fileName) {

    let filePath = path.resolve(__dirname, `../../../uploads/${type}/${id}/${fileName}`)
    
    if(fs.existsSync(filePath)) {

        fs.unlinkSync(filePath)

    }
}

function deleteFolder(id, type) {
        
    let filePath = path.resolve(__dirname, `../../../uploads/${type}/${id}`)
        
    if(fs.existsSync(filePath)) {
            fs.rmdirSync(filePath, {recursive: true})
    }
}

module.exports = app;
