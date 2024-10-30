const mongoose = require('mongoose')

const jenisPekerjaanSchema = mongoose.Schema({
    jenis :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('jenis_pekerjaan', jenisPekerjaanSchema)