const mongoose = require('mongoose')

const masterDataBelumBekerja = mongoose.Schema({
    id_prodi : {
        type : mongoose.Types.ObjectId,
        ref : 'Prodi'
    },
    pekerjaan: [
        {
            namaBidang: {
                type: String,
                required: true
            },
            kategoriPekerjaan: [
                {
                    kategori: {
                        type: String,
                        required: true
                    },
                    jenis: [
                        {
                            type: String,
                            required: true
                        }
                    ]
                }
            ]
            // status : {
            //     type : String,
            //     required : true
            // }
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

})

module.exports = mongoose.model('master_data_belum_bekerja', masterDataBelumBekerja)