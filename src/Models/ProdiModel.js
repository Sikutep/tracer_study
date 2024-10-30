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
        type: String,
        enum: ['D1', 'D2', 'D3', 'D4'],
        required: true
    },
    akreditasi : {
        type: String,
        enum: ['Unggul', 'Baik Sekali', 'Baik', 'Tidak Terakreditasi', 'Terakreditasi Sementara'], 
        required: true
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
        //bidang usaha
        //kategori usaha
        //jenis usaha
       },
       mencari_kerja : {

       },
       belum_bekerja : {
        
       }
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