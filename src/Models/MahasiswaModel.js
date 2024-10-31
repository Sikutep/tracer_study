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
            type: String
        }
    },
    kampus: {
        prodi: {
            type: mongoose.Types.ObjectId,
            ref: "Prodi"
        },
        kampus: {
            type: mongoose.Types.ObjectId,
            ref: "kampus"
        }
    },
    akun: {
        role_id : {
            type: mongoose.Types.ObjectId,
            ref: "role"
        },
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
        type : mongoose.Types.ObjectId,
        ref : "kondisi"
      
    },
    status: {
        type: String,
       enum: ["Aktif", "Non Aktif"],
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
    
    
});

mahasiswaSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);
