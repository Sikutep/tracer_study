const mongoose = require('mongoose')

const ArsipSchema = mongoose.Schema({
    id_kegiatan : {
        type : mongoose.Types.ObjectId,
        ref : "tracer_study"
    },
    pdf_path : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('arsip_kegiatan', ArsipSchema)