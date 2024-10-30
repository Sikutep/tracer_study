const mongoose = require('mongoose')

const kategoriPekerjaanSchema = mongoose.Schema({
    kategori :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('kategori_pekerjaan', kategoriPekerjaanSchema)