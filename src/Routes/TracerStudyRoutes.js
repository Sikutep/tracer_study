const express = require('express')
const { getTracerStudy, getById, addDetailKegiatan, addSkalaKegiatan, addSoal } = require('../Controllers/TracerProcessingController')

const TracerStudyRoutes = express.Router()


TracerStudyRoutes.get('/all', getTracerStudy)
TracerStudyRoutes.get('/:id', getById)



TracerStudyRoutes.post('/detailkegiatan/add', addDetailKegiatan)



TracerStudyRoutes.post('/skalakegiatan/add', addSkalaKegiatan)



TracerStudyRoutes.post('/banksoal/add', addSoal)



module.exports = TracerStudyRoutes