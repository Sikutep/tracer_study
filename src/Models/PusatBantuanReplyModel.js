const mongoose = require('mongoose')

const pusatBantuanReplySchema = new mongoose.Schema({
    pusat_bantuan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pusat_bantuan',
        required: true
    },
    reply_message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('pusat_bantuan_reply', pusatBantuanReplySchema)
