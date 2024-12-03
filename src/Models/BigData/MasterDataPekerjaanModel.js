const mongoose = require('mongoose');

const masterDataSchema = mongoose.Schema({
    id_prodi: {
        type: mongoose.Types.ObjectId,
        ref: "Prodi"
    },
    pekerjaan: [
        {
            namaBidang: {
                type: String,
                required: true
            },
            jenisPekerjaan: [
                {
                    jenis: {
                        type: String,
                        required: true
                    },
                    posisi: [
                        {
                            type: String,
                            required: true
                        }
                    ]
                }
            ],
            status : {
                type : String,
                required : true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware untuk update `updatedAt` sebelum menyimpan
masterDataSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('master_data_pekerjaan', masterDataSchema);
