const mongoose = require('mongoose')

const soalSchema = mongoose.Schema({
    soal : {
        type : String,
        required : true,
    },
    jawaban: [
        {
            jawaban: {
                type: String,
                required: true
            },
            bobot_jawaban: {
                type: Number,
                required: true
            }
        }
    ]
    
})

module.exports = mongoose.model('soal', soalSchema)

