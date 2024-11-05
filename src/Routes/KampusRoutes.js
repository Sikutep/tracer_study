const express = require('express')

const {getAll, addKampus, editKampus, deleteKampus} = require('../Controllers/KampusController')

const KampusRoutes = express.Router()

KampusRoutes.get('/all', getAll)
KampusRoutes.post('/add', addKampus)
KampusRoutes.put('/edit/:id', editKampus)
KampusRoutes.delete('/delete/:id', deleteKampus)

module.exports = KampusRoutes