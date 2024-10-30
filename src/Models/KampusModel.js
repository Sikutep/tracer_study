const mongoose = require('mongoose')

const kampusSchema = mongoose.Schema({
    kode_pt : {
        type : Number,
        unique: true,
        required: true
    },
    tanggal_berdiri : {
        required : true,
        type : Date
    },
    tanggal_sk : {
        type : String,
        required : true
    },
    alamat : {
        type : String,
        required : true
    },
    psdku : {
        type : String,
        required: true
    },
    prodi :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Prodi",
            required : true
        }
    ],
    pengguna : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            
        }
    ],
    akreditasi : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "akreditasi",
        required : true
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

kampusSchema.pre('save', function(next){
    this.UpdateAt = Date.now()
    next()
})

module.exports = mongoose.model('kampus', kampusSchema)