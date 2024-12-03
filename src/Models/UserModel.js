const mongoose = require('mongoose');


const PenggunaSchema = mongoose.Schema({
    avatar : {
        type: String,
        required : true
    },
    nama :{
        type: String,
        required: true
    },
    nip :{
        type: Number,
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
        ref: "role" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    UpdateAt: { 
        type: Date, 
        default: Date.now 
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    
});

PenggunaSchema.pre('save', function(next){
    this.UpdateAt = Date.now()
    next()
})

module.exports = mongoose.model("Pengguna", PenggunaSchema );

