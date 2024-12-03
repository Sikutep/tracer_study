const mongoose = require('mongoose')


const pusatBantuanSchema = mongoose.Schema({
    nama : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    judul : {
        type : String,
        required : true
    },
    Deskripsi : {
        type : String,
        required : true 
    },

    status : {
        type : String,
        enum : ['Terbaru', 'Diproses', 'Selesai'],
        default : 'Terbaru'
    },

    createdAt : {
        type : Date,
        default : Date.now()
    }

})

module.exports = mongoose.model('pusat_bantuan', pusatBantuanSchema)