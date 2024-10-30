const mongoose = require('mongoose')

const bidangUsahaSchema = mongoose.Schema({
    bidang_usaha : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('bidang_usaha', bidangUsahaSchema)