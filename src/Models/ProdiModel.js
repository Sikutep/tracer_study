const mongoose = require('mongoose')

const prodiSchema = mongoose.Schema({
    kode : {
        required : true,
        type: String
    },
    nama : {
        required : true,
        type: String
    },
    jenjang : {
        type: mongoose.Types.ObjectId,
        ref: "jenjang",
        required : true
    },
    akreditasi : {
        type: mongoose.Types.ObjectId,
        ref: "akreditasi",
        required : true
    },

    kondisi : {
       bekerja : {
        id_bidang : {
            type : mongoose.Types.ObjectId,
            ref: "bidang_pekerjaan",
            required : true
        },
        id_kategori : {
            type : mongoose.Types.ObjectId,
            ref: "kategori_pekerjaan",
            required : true
        },
        id_jenis : {
            type : mongoose.Types.ObjectId,
            ref: "jenis_pekerjaan",
            required : true
        }
       },
       wiraswasta : {
        id_bidang : {
            type : mongoose.Types.ObjectId,
            ref: "bidang_usaha",
            required : true
        },
        id_kategori : {
            type : mongoose.Types.ObjectId,
            ref: "kategori_usaha",
            required : true
        },
        id_jenis : {
            type : mongoose.Types.ObjectId,
            ref: "jenis_usaha",
            required : true
        }
        },
    },
    status : {
        type : String,
        required : true,
        enum: ['Aktif', 'Non Aktif'],
        default: 'Aktif'
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
   
    
})

prodiSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Prodi", prodiSchema)