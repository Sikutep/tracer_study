const mongoose = require('mongoose')

const tahunLulusanSchema = mongoose.Schema({
    tahun_lulusan :{
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('tahun_lulusan', tahunLulusanSchema)