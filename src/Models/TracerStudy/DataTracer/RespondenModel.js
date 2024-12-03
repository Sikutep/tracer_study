const mongoose = require('mongoose')

const respondenSchema = mongoose.Schema({
    id_mahasiswa : {
        type : mongoose.Types.ObjectId,
        ref : 'mahasiswa'
    },
    jawaban : [{
        id_soal : {
            type : mongoose.Types.ObjectId,
            ref : 'soal'
        },
        jawaban : {
            type : String,
            required : true
        },
        bobot_jawaban : {
            type : Number,
            required : true
        }
    }]
})

module.exports = mongoose.model('responden', respondenSchema)