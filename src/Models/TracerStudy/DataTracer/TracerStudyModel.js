const mongoose = require('mongoose')

const tracerStudySchema = mongoose.Schema({
    id_detail : {
        type : mongoose.Types.ObjectId,
        ref: "detail_kegiatan"
    }, 
    skala_kegiatan : {
        skala_kegiatan : {
            type : String,
            enum : ['PSDKU', 'Nasional']
        },
        tahun_lulusan : {
            type : mongoose.Types.ObjectId,
            ref : "tahun_lulusan"
        },
        kampus : {
            type : mongoose.Types.ObjectId,
            ref : "kampus"
        },
        prodi : {
            type : mongoose.Types.ObjectId,
            ref : "prodi"
        },
        
    },
    id_soal : {
        type : mongoose.Types.ObjectId,
        ref : "soal"
    },
    atensi : {
        atensi_horizontal : {
            type : mongoose.Types.ObjectId,
            ref : "atensi_horizontal"
        },
        atensi_vertikal : {
            type : mongoose.Types.ObjectId,
            ref : "atensi_vertikal"
        }
    },
    id_pembuat : {
        type : mongoose.Types.ObjectId,
        ref : "atensi_vertikal"
    },
    id_responden : {
        type : mongoose.Types.ObjectId,
        ref : 'responden'
    },
    status : {
        enum : ['Draft', 'Berlangsung', 'Selesai', 'Dibatalkan'],
        type : String,
        default : 'Draft'
    },
    publishAt : {
        type : Date
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

    tracerStudySchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('tracer_study', tracerStudySchema)

