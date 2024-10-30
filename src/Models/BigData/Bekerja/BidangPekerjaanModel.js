const mongoose = require('mongoose')

const bidangPekerjaanSchema = mongoose.Schema({
    bidang : {
        type : String,
        required : true
    },
})

module.exports = mongoose.model('bidang_pekerjaan', bidangPekerjaanSchema)