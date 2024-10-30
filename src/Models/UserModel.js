const mongoose = require('mongoose');


const PenggunaSchema = mongoose.Schema({
    nama :{
        type: String,
        required: true
    },
    nip :{
        type: String,
        required: true
    },
    jabatan :{
        type : String,
        required: true
    },
    pendidikan : {
        type : String,
        required : true
    },
    tentang : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    is_active : {
        type: Boolean,
        default: true
    },
    not_delete : {
        type: Boolean,
        default: true
    },
    roleId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Role" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    UpdateAt: { 
        type: Date, 
        default: Date.now 
    },
});

PenggunaSchema.pre('save', function(next){
    this.UpdateAt = Date.now()
    next()
})

module.exports = mongoose.model("Pengguna", PenggunaSchema );

