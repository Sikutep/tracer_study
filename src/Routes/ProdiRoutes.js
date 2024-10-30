const express = require('express')

const { getAll, createProdi, getById, editProdi, deleteProdi } = require('../Controllers/ProdiController')

const prodiRoute = express.Router()

prodiRoute.get('/all', getAll)
prodiRoute.get('/:id', getById)
prodiRoute.post('/create', createProdi)
prodiRoute.put('/editprodi/:id', editProdi)
prodiRoute.delete('/deleteprodi/:id', deleteProdi)

module.exports = prodiRoute