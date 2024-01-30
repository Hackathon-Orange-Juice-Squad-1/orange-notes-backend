
        if (allowedMimes.includes(file.mimetype)){
            cb(null, true);
    } else {
        cb(new Error('Formato da imagem inválido.'))
    }
}
}
