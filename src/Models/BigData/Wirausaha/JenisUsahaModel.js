const mongoose = require('mongoose')

const jenisUsahaSchema = mongoose.Schema({
    jenis_usaha : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('jenis_usaha', jenisUsahaSchema)