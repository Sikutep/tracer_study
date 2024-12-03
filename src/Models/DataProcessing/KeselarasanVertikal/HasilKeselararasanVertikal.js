const mongoose = require('mongoose')

const KeselarasanVertikalSchema = mongoose.Schema({
    id_tracer : {
        type : mongoose.Types.ObjectId,
        ref : "tracer_study"
    },
    id_mahasiswa : {
        type : mongoose.Types.ObjectId,
        ref : 'mahasiswa'
    },
    tinggi : {
        type : Number,
        required : true
    },
    sama : {
        type : Number,
        required : true
    },
    rendah : {
        type : Number,
        required : true
    },
    tanggal_diperbarui : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('hasil_keselarasan_vertikal', KeselarasanVertikalSchema)