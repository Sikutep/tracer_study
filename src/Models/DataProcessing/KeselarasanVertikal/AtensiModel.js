

const mongoose = require('mongoose')

const atensiVertikalSchema = mongoose.Schema({
    kriteria : {
        type : String,
        required : true
    },
    deskripsi : {
        type : String,
        required : true
    },
    logika : {
        type : String,
        required : true
    },
    atensi : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('atensi_vertikal', atensiVertikalSchema)