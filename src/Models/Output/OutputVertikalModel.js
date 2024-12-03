const mongoose = require('mongoose')

const outputVertikalSchema = mongoose.Schema({

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
        ref: 'prodi'
    },

    keselarasan :
        {
            tinggi : 
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
            sama : {
                jumlah : {
                    type : Number,
                    required : true
                },
                persentase : {
                    type : String,
                    required : true
                }
            },
            rendah : {
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
        default : Date.now()
    },
    updateAt : {
        type : Date,
        default : Date.now()
    }
})

outputVertikalSchema.pre('save', function (){
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model('output_vertikal', outputVertikalSchema)