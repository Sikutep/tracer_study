const mongoose = require('mongoose')

const hasilKeselarasanHorizontal = new mongoose.Schema({
    id_mahasiswa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mahasiswa',
        required: true
    },
    selaras: {
        type: Boolean,
        required: true
    },
    tanggal_diperbarui: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('hasil_keselarasan_horizontal', hasilKeselarasanHorizontal);