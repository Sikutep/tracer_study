const mongoose = require('mongoose')

const jenjangSchema = mongoose.Schema({
    jenjang : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('jenjang', jenjangSchema)