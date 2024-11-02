//kriteria, //deskripsi, min, max Atensi

const mongoose = require('mongoose')

const atensiHorizontalSchema = mongoose.Schema({
    kriteria : {
        type : String,
        required : true
    },
    deskripsi : {
        type : String,
        required : true
    },
    min : {
        type : Number,
        required : true
    },
    max : {
        type : Number,
        required : true
    },
    atensi : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('atensi_horizontal', atensiHorizontalSchema)