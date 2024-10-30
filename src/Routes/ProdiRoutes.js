const express = require('express')

const { getAll, createProdi, getById, editProdi, deleteProdi, addAkreditasi } = require('../Controllers/ProdiController')
const { addJenjang } = require('../Controllers/JenjangController')

const prodiRoute = express.Router()

prodiRoute.get('/all', getAll)
prodiRoute.get('/:id', getById)
prodiRoute.post('/create', createProdi)
prodiRoute.put('/editprodi/:id', editProdi)
prodiRoute.delete('/deleteprodi/:id', deleteProdi)


prodiRoute.post('/addjenjang', addJenjang)
prodiRoute.post('/addakreditasi', addAkreditasi)

module.exports = prodiRoute