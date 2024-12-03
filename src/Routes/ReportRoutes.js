const express = require('express')
const { generateReportHorizontal } = require('../Controllers/TracerProcessingController')

const ReportRoutes = express.Router()


ReportRoutes.get('/horizontal', generateReportHorizontal)


module.exports = ReportRoutes