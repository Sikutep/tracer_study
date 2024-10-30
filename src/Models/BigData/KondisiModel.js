  // enum : ["Bekerja", "Sedang Mencari Kerja", "Wirausaha", "Belum Memungkinkan Bekerja"],
  // default : "Sedang Mencari Kerja

  const mongoose = require('mongoose')

  const kondisiSchema = mongoose.Schema({
    kondisi :{
        type : String,
        required : true
    }
  })

  module.exports = mongoose.model('kondisi', kondisiSchema)