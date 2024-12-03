const mongoose = require('mongoose');


const mahasiswaKondisiSchema = mongoose.Schema({
    id_mahasiswa : {
         type : mongoose.Types.ObjectId,
         required: true,
         ref: "Mahasiswa"
    },
    pekerjaan: [
        {
            bidang : {
                type : String,
            },
            jenis_pekerjaan : [
                {
                    jenis : {
                        type : String,
                    },
                    posisi : {
                        type : String,
                    },

                }
            ]
        }
        
    ],
    wirausaha: [
        {
            bidang : {
                type : String,
            },
            jenis_wirausaha : [
                {
                    kategori : {
                        type : String,
                    },
                    jenis : {
                        type : String,
                    },

                }
            ]
        }
        
    ],
    belum_bekerja : [
        {
            bidang : {
                type : String,
            },
            kategori_pekerjaan : [
                {
                    kategori : {
                        type : String,
                    },
                    jenis : {
                        type : String,
                    },

                }
            ]
        }
    ],
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

mahasiswaKondisiSchema.pre('validate', function (next) {
    const hasPekerjaan = Array.isArray(this.pekerjaan) && this.pekerjaan.length > 0;
    const hasWirausaha = Array.isArray(this.wirausaha) && this.wirausaha.length > 0;

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
