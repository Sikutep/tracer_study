const mongoose = require('mongoose');

const mahasiswaKondisiSchema = mongoose.Schema({
    id_mahasiswa : {
         type : mongoose.Types.ObjectId,
         required: true,
         ref: "Mahasiswa"
    },
    pekerjaan: {
        bidang: {
            type: mongoose.Types.ObjectId,
            ref: "bidang_pekerjaan"
        },
        kategori: {
            type: mongoose.Types.ObjectId,
            ref: "kategori_pekerjaan"
        },
        jenis: {
            type: mongoose.Types.ObjectId,
            ref: "jenis_pekerjaan"
        }
    },
    wirausaha: {
        bidang: {
            type: mongoose.Types.ObjectId,
            ref: "bidang_wirausaha"
        },
        kategori: {
            type: mongoose.Types.ObjectId,
            ref: "kategori_wirausaha"
        },
        jenis: {
            type: mongoose.Types.ObjectId,
            ref: "jenis_wirausaha"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    not_delete : {
        type: Boolean,
        default: true
    }
});
// Validasi kustom untuk memastikan hanya salah satu yang diisi
mahasiswaKondisiSchema.pre('validate', function(next) {
    const hasPekerjaan = this.pekerjaan && 
                        (this.pekerjaan.bidang || this.pekerjaan.kategori || this.pekerjaan.jenis);
    const hasWirausaha = this.wirausaha && 
                         (this.wirausaha.bidang || this.wirausaha.kategori || this.wirausaha.jenis);

    if (hasPekerjaan && hasWirausaha) {
        return next(new Error('Hanya satu dari pekerjaan atau wirausaha yang boleh diisi.'));
    }
    if (!hasPekerjaan && !hasWirausaha) {
        return next(new Error('Salah satu dari pekerjaan atau wirausaha harus diisi.'));
    }

    next();
});

mahasiswaKondisiSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('mahasiswa_kondisi', mahasiswaKondisiSchema);
