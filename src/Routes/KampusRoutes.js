const express = require('express')

const {getAll, addKampus, editKampus} = require('../Controllers/KampusController')

const KampusRoutes = express.Router()

KampusRoutes.get('/all', getAll)
KampusRoutes.post('/add', addKampus)
KampusRoutes.put('/edit/:id', editKampus)

module.exports = KampusRoutes