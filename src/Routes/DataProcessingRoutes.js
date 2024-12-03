const express = require('express')

const { dataBekerja, hasilKeselarasanHorizontal, processingForTable } = require('../Controllers/DataProcessingController')
const { authenticateToken } = require('../Middleware/AuthenticateMiddleware')
const { combinedRoleCheck } = require('../Middleware/CheckRoleMiddleware')

const DataProcessingRoutes = express.Router()

// DataProcessingRoutes.get('/databekerja',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), dataBekerja)
// DataProcessingRoutes.get('/horizontal',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), hasilKeselarasanHorizontal)
// DataProcessingRoutes.get('/table_vertikal',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), processingForTable)


module.exports = DataProcessingRoutes