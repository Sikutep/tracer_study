const mongoose = require('mongoose')


const akreditasiSchema = mongoose.Schema({
    akreditasi : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('akreditasi', akreditasiSchema)