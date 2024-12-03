const mongoose = require('mongoose')

const outputHorizontalSchema = mongoose.Schema({

 
    tahun_lulusan : {
        required: true,
        type : Number
    },

    jenjang : {
        required : true,
        type : String
    },

    prodi : {
        type : mongoose.Types.ObjectId,
        ref: 'Prodi'
    },

    keselarasan :
        {
            selaras : 
                {
                    jumlah : {
                        type : Number,
                        required : true
                    },
                    persentase : {
                        type : String,
                        required : true
                    }
                },            
            tidak_selaras : {
                jumlah : {
                    type : Number,
                    required : true
                },
                persentase : {
                    type : String,
                    required : true
                }
            }
        },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updateAt : {
        type : Date,
        default : Date.now
    }
})

outputHorizontalSchema.pre('save', function (){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('output_horizontal', outputHorizontalSchema)