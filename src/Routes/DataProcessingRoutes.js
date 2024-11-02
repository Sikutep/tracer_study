const express = require('express')

const { dataBekerja, hasilKeselarasanHorizontal } = require('../Controllers/DataProcessingController')

const DataProcessingRoutes = express.Router()

DataProcessingRoutes.get('/databekerja', dataBekerja)
DataProcessingRoutes.get('/horizontal', hasilKeselarasanHorizontal)


module.exports = DataProcessingRoutes