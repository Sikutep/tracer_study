const express = require('express')
const {addBidang, addKategori, addJenis} = require('../Controllers/WirausahaController')

const WirausahaRoutes = express.Router()

WirausahaRoutes.post('/addbidang', addBidang)
WirausahaRoutes.post('/addkategori', addKategori)
WirausahaRoutes.post('/addJenis', addJenis)


module.exports = WirausahaRoutes