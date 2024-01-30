const multer = require('multer')
const path = require('path')
const AWS = require('aws-sdk')
const { error } = require('console')
const multerS3 = require('multer-s3')
const { Error } = require('mongoose')
const crypto = require('crypto')

const storageTypes = {
    local: multer.diskStorage({
        destination: (req,file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16,(error, hash) => {
                if (error) cb(error)

                file.key = `${hash.toString('hex')} - ${file.originalname}`

                cb(null, file.key)
            })
        }
}),
    s3: multerS3({
        s3: new AWS.S3(),
        bucket: 'orange-notes-squad1-s3',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16,(error, hash) => {
            if (error) cb(error)

            const fileName = `${hash.toString('hex')} - ${file.originalname}`

            cb(null, fileName)
        })
    },
    }),
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp'),
    storage: storageTypes["local"],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) =>{
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/pjpeg'
        ]

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true)
        } else { 
            cb(new Error)('Imagem inválida')}
        }
}