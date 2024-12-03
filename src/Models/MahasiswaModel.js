    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt')

    const mahasiswaSchema = mongoose.Schema({
        pribadi: {
            avatar: {
                type: String,
            
                default : '/profile.jpg'
            },
            nim: {
                type: Number,
                required: true,
                unique : true
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
            },
            tahun_lulusan : {
                type : mongoose.Types.ObjectId,
                ref : "tahun_lulusan"
            }
        },
        akun: {
            role_id : {
                type: mongoose.Types.ObjectId,
                ref: "role",
                default : "672d79ed861bcc3c8128d859"
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
        default : "Aktif"
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

    // mahasiswaSchema.pre('save', async function (next) {
    //     if (this.isModified('akun.password')) {
    //         const salt = await bcrypt.genSalt(10);
    //         this.akun.password = await bcrypt.hash(this.akun.password, salt);
    //     }
    //     this.updatedAt = Date.now();
    //     next();
    // });

    module.exports = mongoose.model('Mahasiswa', mahasiswaSchema);
