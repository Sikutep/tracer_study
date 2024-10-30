const mongoose = require('mongoose');

const mahasiswaSchema = mongoose.Schema({
    pribadi: {
        avatar: {
            type: String,
            required: true
        },
        nim: {
            type: Number,
            required: true
        },
        nama: {
            type: String,
            required: true
        },
        jk: {
            type: String,
            enum: ["Laki - Laki", "Perempuan"],
            required: true
        },
        ttl: {
            type: Date
        }
    },
    kampus: {
        prodi: {
            type: mongoose.Types.ObjectId,
            ref: "Prodi"
        },
        kampus: {
            type: mongoose.Types.ObjectId,
            ref: "Kampus"
        }
    },
    akun: {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    kondisi : {
        type : String,
        enum : ["Bekerja", "Sedang Mencari Kerja", "Wirausaha", "Belum Memungkinkan Bekerja"],
        default : "Sedang Mencari Kerja"
    },
    
    bidang : {
        Type : Text
    },
    kategori : {
        Type : Text
    },
    jenis : {
        Type : Text
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
    },
    
    // status: {
    //     type: String,
    //     required: true
    // }
});

mahasiswaSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);
