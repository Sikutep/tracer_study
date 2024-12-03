const express = require('express')

const { addBelumBekerja, getBelumBekerja } = require('../Controllers/BelumBekerjaController')

const BelumBekerjaRouter = express.Router()


BelumBekerjaRouter.post('/add', addBelumBekerja)
BelumBekerjaRouter.get('/all', getBelumBekerja)


module.exports = BelumBekerjaRouter