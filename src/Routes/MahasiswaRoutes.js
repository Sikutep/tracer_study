const express = require('express')

const { add, getAll, getById, addMahasiswa, edit, deleteMahasiswa, addmahasiswaKondisi } = require('../Controllers/MahasiswaController')
const { addTahunLulusManualy } = require('../Controllers/TahunLulusanController')

const MahasiswaRoutes = express.Router()

MahasiswaRoutes.get('/all', getAll)
MahasiswaRoutes.get('/get/:id', getById)
MahasiswaRoutes.post('/create', addMahasiswa)
MahasiswaRoutes.put('/edit/:id', edit),
MahasiswaRoutes.delete('/delete/:id', deleteMahasiswa)


MahasiswaRoutes.post('/addmahasiswakondisi', addmahasiswaKondisi)


MahasiswaRoutes.post('/addkondisi', add)

MahasiswaRoutes.post('/addtahunlulusan', addTahunLulusManualy)

module.exports = MahasiswaRoutes
