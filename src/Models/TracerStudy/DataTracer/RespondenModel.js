const mongoose = require('mongoose')

const respondenSchema = mongoose.Schema({
    id_mahasiswa : {
        type : mongoose.Types.ObjectId,
        ref : 'mahasiswa'
    },
    soal : {
        id_soal : {
            type : mongoose.Types.ObjectId,
            ref : 'soal'
        }
    }
})

module.exports = mongoose.model('responden', respondenSchema)