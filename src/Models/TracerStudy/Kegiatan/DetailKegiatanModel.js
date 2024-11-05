const mongoose = require('mongoose')

const detailKegiatanSchema = mongoose.Schema({
    banner : {
        type : String,
    },
    nama_kegiatan : {
        type : String,
        required : true
    },
    tanggal_mulai : {
        type : Date,
        required : true,
        default : Date.now()
    },
    tanggal_berakhir : {
        type : Date,
        required : true,
    },
    latar_belakang : {
        type : String,
    },
    tujuan_kegiatan : {
        type : String,
    },
    manfaat_kegiatan : {
        type : String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
})

detailKegiatanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('detail_kegiatan', detailKegiatanSchema)