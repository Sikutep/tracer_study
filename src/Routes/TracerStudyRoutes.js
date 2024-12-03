const express = require('express')
const { getTracerStudy, getById, addDetailKegiatan, addSkalaKegiatan, addSoal, getTracerStudyById, getBankSoal, updateSoal, deleteSoal, addKriteriaAtensi, published, deleteTracer, editTracerStudyById, generateReportHorizontal, generateReportVertikal, generateReport } = require('../Controllers/TracerProcessingController')
const { addAtensiHorizotal, getAtensiHorizontal } = require('../Controllers/AtensiHorizontalController')
const { addAtensiVertikal, getAtensiVertikal } = require('../Controllers/AtensiVertikalController')
const { calculateHorizontal } = require('../Controllers/Processing/HorizontalController')
const { getTracerMahasiswa} = require('../Controllers/MahasiswaController')
const { combinedRoleCheck} = require('../Middleware/CheckRoleMiddleware');
const { authenticateToken } = require('../Middleware/AuthenticateMiddleware')

const TracerStudyRoutes = express.Router()

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/all:
 *   get:
 *     summary: Mendapatkan semua tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua tracer study
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TracerStudy'
 *       403:
 *         description: Akses ditolak
 */
TracerStudyRoutes.get('/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getTracerStudy)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/{id}:
 *   get:
 *     summary: Mendapatkan tracer study berdasarkan ID
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data tracer study ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TracerStudy'
 *       404:
 *         description: Tracer study tidak ditemukan
 */
TracerStudyRoutes.get('/:id_tracer', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getById)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/edit/{id}:
 *   put:
 *     summary: Mengedit tracer study berdasarkan ID
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TracerStudy'
 *     responses:
 *       200:
 *         description: Tracer study berhasil diperbarui
 *       404:
 *         description: Tracer study tidak ditemukan
 */
TracerStudyRoutes.put('/edit/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), editTracerStudyById)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/delete/{id}:
 *   delete:
 *     summary: Menghapus tracer study berdasarkan ID
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tracer study berhasil dihapus
 *       404:
 *         description: Tracer study tidak ditemukan
 */
TracerStudyRoutes.delete('/delete/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), deleteTracer)



TracerStudyRoutes.get('/tracer_mahasiswa/all', authenticateToken, combinedRoleCheck('Mahasiswa'), getTracerMahasiswa)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/detailkegiatan/add:
 *   post:
 *     summary: Menambahkan detail kegiatan ke tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetailKegiatan'
 *     responses:
 *       201:
 *         description: Detail kegiatan berhasil ditambahkan
 *       400:
 *         description: Bad request
 */
TracerStudyRoutes.post('/detailkegiatan/add', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addDetailKegiatan)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/detailkegiatan/add:
 *   post:
 *     summary: Menambahkan detail kegiatan ke tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetailKegiatan'
 *     responses:
 *       201:
 *         description: Detail kegiatan berhasil ditambahkan
 *       400:
 *         description: Bad request
 */
TracerStudyRoutes.put('/skalakegiatan/add/:id', authenticateToken,  combinedRoleCheck('Admin', 'Super Admin'), addSkalaKegiatan)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/banksoal/add/{id}:
 *   post:
 *     summary: Menambahkan soal ke bank soal tracer study
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Soal'
 *     responses:
 *       201:
 *         description: Soal berhasil ditambahkan ke bank soal
 *       400:
 *         description: Bad request
 */
TracerStudyRoutes.post('/banksoal/add/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addSoal)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/bank_soal/get/{id}:
 *   get:
 *     summary: Mendapatkan Semua Soal
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari bank soal yang ingin diambil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data bank soal ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soal'
 *       404:
 *         description: Bank soal tidak ditemukan
 *       403:
 *         description: Akses ditolak
 */
TracerStudyRoutes.get('/bank_soal/get/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getBankSoal)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/bank_soal/edit/{id}:
 *   put:
 *     summary: Mengedit soal di bank soal tracer study
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Soal'
 *     responses:
 *       200:
 *         description: Soal berhasil diperbarui
 *       404:
 *         description: Soal tidak ditemukan
 */
TracerStudyRoutes.put('/bank_soal/edit/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), updateSoal)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/bank_soal/delete/{id}:
 *   delete:
 *     summary: Menghapus soal dari bank soal tracer study
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Soal berhasil dihapus dari bank soal
 *       404:
 *         description: Soal tidak ditemukan
 */
TracerStudyRoutes.delete('/bank_soal/delete/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), deleteSoal)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/atensi_horizontal/add:
 *   post:
 *     summary: Menambahkan atensi horizontal ke tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtensiHorizontal'
 *     responses:
 *       201:
 *         description: Atensi horizontal berhasil ditambahkan
 *       400:
 *         description: Bad request
 */
TracerStudyRoutes.post('/atensi_horizontal/add', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addAtensiHorizotal )

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/atensi_horizontal/all:
 *   get:
 *     summary: Mendapatkan semua atensi horizontal
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar atensi horizontal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AtensiHorizontal'
 *       403:
 *         description: Akses ditolak
 */
TracerStudyRoutes.get('/atensi_horizontal/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getAtensiHorizontal)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/atensi_vertikal/add:
 *   post:
 *     summary: Menambahkan atensi vertikal ke tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtensiVertikal'
 *     responses:
 *       201:
 *         description: Atensi vertikal berhasil ditambahkan
 *       400:
 *         description: Bad request
 */
TracerStudyRoutes.post('/atensi_vertikal/add', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addAtensiVertikal )

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/atensi_vertikal/all:
 *   get:
 *     summary: Mendapatkan semua atensi vertikal
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar atensi vertikal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AtensiVertikal'
 *       403:
 *         description: Akses ditolak
 */
TracerStudyRoutes.get('/atensi_vertikal/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getAtensiVertikal)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/atensi/apply/{id}:
 *   post:
 *     summary: Menambahkan kriteria atensi ke tracer study
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kriteria atensi berhasil diterapkan
 *       404:
 *         description: Tracer study tidak ditemukan
 */
TracerStudyRoutes.post('/atensi/apply/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addKriteriaAtensi)


/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/process/all:
 *   get:
 *     summary: Menghitung atensi horizontal untuk semua tracer study
 *     tags: [Tracer Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proses penghitungannya berhasil
 *       403:
 *         description: Akses ditolak
 */
TracerStudyRoutes.get('/process/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), calculateHorizontal)

/**
 * @swagger
 * http://192.168.18.176:5000/tracerstudy/{id}/publish:
 *   post:
 *     summary: Mempublikasikan tracer study
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tracer study berhasil dipublikasikan
 */
TracerStudyRoutes.post('/:id/publish', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), published)


TracerStudyRoutes.get('/horizontal_report',  generateReportHorizontal);

/**
 * @swagger
 * /tracerstudy/vertikal_report/{id}:
 *   get:
 *     summary: Mengambil serta Memproses Data Output Vertikal untuk Report
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tracer untuk memproses laporan vertikal
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil dan memproses laporan vertikal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan dalam memproses data
 */
TracerStudyRoutes.get('/vertikal_report/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), generateReportVertikal);

/**
 * @swagger
 * /tracerstudy/report/{type}/{id_tracer}:
 *   get:
 *     summary: Mengambil serta Memproses Data Output Horizontal atau Vertikal untuk Report
 *     tags: [Tracer Study]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [horizontal, vertikal]
 *         description: Jenis report yang ingin di-generate (horizontal atau vertikal)
 *       - in: path
 *         name: id_tracer
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tracer untuk memproses laporan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil dan memproses laporan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Jenis report tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan dalam memproses data
 */
TracerStudyRoutes.get('/report/:type/:id_tracer', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), generateReport)

/**
 * @swagger
 * components:
 *   schemas:
 *     TracerStudy:
 *       type: object
 *       required:
 *         - id_detail
 *         - skala_kegiatan
 *         - id_soal
 *         - atensi
 *         - id_pembuat
 *         - id_responden
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk tracer study
 *           example: "64e5b8f4861bcc3c8128d125"
 *         id_detail:
 *           type: string
 *           description: ID detail kegiatan
 *           example: "64e5b8f4861bcc3c8128d126"
 *         skala_kegiatan:
 *           type: object
 *           description: Skala kegiatan
 *           properties:
 *             skala_kegiatan:
 *               type: string
 *               enum: ["Nasional", "PSDKU"]
 *             tahun_lulusan:
 *               type: string
 *               description: ID tahun lulusan
 *               example: "64e5b8f4861bcc3c8128d127"
 *             kampus:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID kampus
 *                 example: "64e5b8f4861bcc3c8128d128"
 *             prodi:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID prodi
 *                 example: "64e5b8f4861bcc3c8128d129"
 *         id_soal:
 *           type: array
 *           items:
 *             type: string
 *             description: ID soal
 *             example: "64e5b8f4861bcc3c8128d130"
 *         atensi:
 *           type: object
 *           properties:
 *             atensi_horizontal:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID atensi horizontal
 *                 example: "64e5b8f4861bcc3c8128d131"
 *             atensi_vertikal:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID atensi vertikal
 *                 example: "64e5b8f4861bcc3c8128d132"
 *         id_pembuat:
 *           type: string
 *           description: ID pengguna pembuat tracer study
 *           example: "64e5b8f4861bcc3c8128d133"
 *         id_responden:
 *           type: array
 *           items:
 *             type: string
 *             description: ID responden
 *             example: "64e5b8f4861bcc3c8128d134"
 *         status:
 *           type: string
 *           description: Status tracer study
 *           enum: ["Draft", "Berlangsung", "Selesai", "Dibatalkan"]
 *           default: "Draft"
 *         publishAt:
 *           type: string
 *           format: date-time
 *           description: Waktu publish tracer study
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan tracer study
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembaruan tracer study
 *         not_delete:
 *           type: boolean
 *           description: Status tidak dihapus
 *           example: true
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TracerStudy:
 *       type: object
 *       required:
 *         - id_detail
 *         - skala_kegiatan
 *         - id_soal
 *         - atensi
 *         - id_pembuat
 *         - id_responden
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk tracer study
 *           example: "64e5b8f4861bcc3c8128d125"
 *         id_detail:
 *           type: string
 *           description: ID detail kegiatan
 *           example: "64e5b8f4861bcc3c8128d126"
 *         skala_kegiatan:
 *           type: object
 *           description: Skala kegiatan
 *           properties:
 *             skala_kegiatan:
 *               type: string
 *               enum: ["Nasional", "PSDKU"]
 *             tahun_lulusan:
 *               type: string
 *               description: ID tahun lulusan
 *               example: "64e5b8f4861bcc3c8128d127"
 *             kampus:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID kampus
 *                 example: "64e5b8f4861bcc3c8128d128"
 *             prodi:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID prodi
 *                 example: "64e5b8f4861bcc3c8128d129"
 *         id_soal:
 *           type: array
 *           items:
 *             type: string
 *             description: ID soal
 *             example: "64e5b8f4861bcc3c8128d130"
 *         atensi:
 *           type: object
 *           properties:
 *             atensi_horizontal:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID atensi horizontal
 *                 example: "64e5b8f4861bcc3c8128d131"
 *             atensi_vertikal:
 *               type: array
 *               items:
 *                 type: string
 *                 description: ID atensi vertikal
 *                 example: "64e5b8f4861bcc3c8128d132"
 *         id_pembuat:
 *           type: string
 *           description: ID pengguna pembuat tracer study
 *           example: "64e5b8f4861bcc3c8128d133"
 *         id_responden:
 *           type: array
 *           items:
 *             type: string
 *             description: ID responden
 *             example: "64e5b8f4861bcc3c8128d134"
 *         status:
 *           type: string
 *           description: Status tracer study
 *           enum: ["Draft", "Berlangsung", "Selesai", "Dibatalkan"]
 *           default: "Draft"
 *         publishAt:
 *           type: string
 *           format: date-time
 *           description: Waktu publish tracer study
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan tracer study
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembaruan tracer study
 *         not_delete:
 *           type: boolean
 *           description: Status tidak dihapus
 *           example: true
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Soal:
 *       type: object
 *       required:
 *         - soal
 *         - jawaban
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk soal
 *           example: "64e5b8f4861bcc3c8128d136"
 *         soal:
 *           type: string
 *           description: Isi soal
 *           example: "Apa itu Tracer Study?"
 *         jawaban:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               jawaban:
 *                 type: string
 *                 description: Jawaban untuk soal
 *                 example: "Tracer Study adalah penelitian..."
 *               bobot_jawaban:
 *                 type: number
 *                 description: Bobot jawaban untuk penilaian
 *                 example: 10
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Responden:
 *       type: object
 *       required:
 *         - id_mahasiswa
 *         - jawaban
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk responden
 *           example: "64e5b8f4861bcc3c8128d137"
 *         id_mahasiswa:
 *           type: string
 *           description: ID mahasiswa yang menjadi responden
 *           example: "64e5b8f4861bcc3c8128d138"
 *         jawaban:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_soal:
 *                 type: string
 *                 description: ID soal yang dijawab
 *                 example: "64e5b8f4861bcc3c8128d139"
 *               jawaban:
 *                 type: string
 *                 description: Jawaban yang diberikan
 *                 example: "Tracer Study adalah untuk mengevaluasi..."
 *               bobot_jawaban:
 *                 type: number
 *                 description: Bobot jawaban untuk penilaian
 *                 example: 8
 */



module.exports = TracerStudyRoutes




