const mongoose = require('mongoose')

const ArsipPengaduanSchema = mongoose.Schema({
    id_bantuan : {
        type : mongoose.Types.ObjectId,
        ref : "pusat_bantuan"
    },
    pdf_path : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('arsip_pengaduan', ArsipPengaduanSchema)