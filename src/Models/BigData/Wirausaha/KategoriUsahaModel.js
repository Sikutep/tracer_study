const mongoose = require('mongoose')

const kategoriUsahaSchema = mongoose.Schema({
    kategori_usaha : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('kategori_usaha', kategoriUsahaSchema)