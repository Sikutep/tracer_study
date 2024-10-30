const express = require('express')
const {addBidang, addKategori, addJenis} = require('../Controllers/BekerjaController')

const BekerjaRouter = express.Router()

BekerjaRouter.post('/addbidang', addBidang)
BekerjaRouter.post('/addkategori', addKategori)
BekerjaRouter.post('/addJenis', addJenis)


module.exports = BekerjaRouter