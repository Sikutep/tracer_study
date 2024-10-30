const express = require('express')

const {getAll} = require('../Controllers/KampusController')

const KampusRoutes = express.Router()

KampusRoutes.get('/all', getAll)

module.exports = KampusRoutes