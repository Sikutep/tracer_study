const express = require('express')

const { add, getAll, getById, addMahasiswa, edit, deleteMahasiswa, addMahasiswaKondisi, login, getTracerMahasiswa, getSoalByTahunLulusan, getSoalToMahasiswa, postJawabanMahasiswa, handleJawabanAndCalculateScores} = require('../Controllers/MahasiswaController')
const { addTahunLulusManualy, getTahunLulus } = require('../Controllers/TahunLulusanController')
const { authenticateToken, authenticateTokenMahasiswa } = require('../Middleware/AuthenticateMiddleware')
const { combinedRoleCheck, checkMahasiswaRole } = require('../Middleware/CheckRoleMiddleware')
const KondisiModel = require('../Models/BigData/KondisiModel')
const { getKondisi } = require('../Controllers/BekerjaController')
const { getTracerForBerakhir, getTracerForComming } = require('../Controllers/TracerProcessingController')

const MahasiswaRoutes = express.Router()


/**
 * @swagger
 * tags:
 *   name: Mahasiswa
 *   description: API untuk mengelola data mahasiswa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Mahasiswa:
 *       type: object
 *       properties:
 *         pribadi:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *               example: "/profile.jpg"
 *             nim:
 *               type: number
 *               example: 12345678
 *             nama:
 *               type: string
 *               example: "John Doe"
 *             jk:
 *               type: string
 *               enum: ["Laki - Laki", "Perempuan"]
 *               example: "Laki - Laki"
 *             ttl:
 *               type: string
 *               example: "01-01-2000"
 *         kampus:
 *           type: object
 *           properties:
 *             prodi:
 *               type: string
 *               example: "64e5b8f4861bcc3c8128d123"
 *             kampus:
 *               type: string
 *               example: "64e5b8f4861bcc3c8128d124"
 *             tahun_lulusan:
 *               type: string
 *               example: "64e5b8f4861bcc3c8128d125"
 *         akun:
 *           type: object
 *           properties:
 *             role_id:
 *               type: string
 *               example: "672d79ed861bcc3c8128d859"
 *             email:
 *               type: string
 *               example: "johndoe@gmail.com"
 *             password:
 *               type: string
 *               example: "password123"
 *         kondisi:
 *           type: string
 *           example: "64e5b8f4861bcc3c8128d126"
 *         status:
 *           type: string
 *           enum: ["Aktif", "Non Aktif"]
 *           example: "Aktif"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-25T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-25T10:00:00Z"
 *         not_delete:
 *           type: boolean
 *           example: true
 */


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/all:
 *   get:
 *     summary: Mendapatkan semua data mahasiswa
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar semua mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d125"
 *                   pribadi:
 *                     type: object
 *                     properties:
 *                       avatar:
 *                         type: string
 *                         example: "/profile.jpg"
 *                       nim:
 *                         type: number
 *                         example: 12345678
 *                       nama:
 *                         type: string
 *                         example: "John Doe"
 *                       jk:
 *                         type: string
 *                         example: "Laki - Laki"
 *                       ttl:
 *                         type: string
 *                         example: "Jakarta, 1 Januari 2000"
 *                   kampus:
 *                     type: object
 *                     properties:
 *                       prodi:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d120"
 *                       kampus:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d121"
 *                       tahun_lulusan:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d122"
 *                   akun:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       role_id:
 *                         type: string
 *                         example: "672d79ed861bcc3c8128d859"
 *                   kondisi:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d126"
 *                   status:
 *                     type: string
 *                     example: "Aktif"
 *                   createdAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *       401:
 *         description: Akses tidak diizinkan
 *       403:
 *         description: Role tidak memiliki izin
 */
MahasiswaRoutes.get('/all', authenticateToken, combinedRoleCheck('Admin'), getAll);

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/{id}:
 *   get:
 *     summary: Mendapatkan data mahasiswa Berdasarkan ID
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar semua mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d125"
 *                   pribadi:
 *                     type: object
 *                     properties:
 *                       avatar:
 *                         type: string
 *                         example: "/profile.jpg"
 *                       nim:
 *                         type: number
 *                         example: 12345678
 *                       nama:
 *                         type: string
 *                         example: "John Doe"
 *                       jk:
 *                         type: string
 *                         example: "Laki - Laki"
 *                       ttl:
 *                         type: string
 *                         example: "Jakarta, 1 Januari 2000"
 *                   kampus:
 *                     type: object
 *                     properties:
 *                       prodi:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d120"
 *                       kampus:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d121"
 *                       tahun_lulusan:
 *                         type: string
 *                         example: "64e5b8f4861bcc3c8128d122"
 *                   akun:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       role_id:
 *                         type: string
 *                         example: "672d79ed861bcc3c8128d859"
 *                   kondisi:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d126"
 *                   status:
 *                     type: string
 *                     example: "Aktif"
 *                   createdAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *       401:
 *         description: Akses tidak diizinkan
 *       403:
 *         description: Role tidak memiliki izin
 */
MahasiswaRoutes.get('/:id', authenticateToken, combinedRoleCheck('Admin'), getById)

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/add:
 *   post:
 *     summary: Menambahkan data mahasiswa baru
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mahasiswa'
 *     responses:
 *       201:
 *         description: Mahasiswa berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.post('/add', authenticateToken, combinedRoleCheck('Admin'), addMahasiswa);

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/edit/{id}:
 *   put:
 *     summary: Mengedit data mahasiswa berdasarkan ID
 *     tags: [Mahasiswa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mahasiswa'
 *     responses:
 *       200:
 *         description: Mahasiswa berhasil diperbarui
 *       404:
 *         description: Mahasiswa tidak ditemukan
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.put('/edit/:id', authenticateToken, combinedRoleCheck('Admin', 'Mahasiswa'), edit);

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/delete/{id}:
 *   delete:
 *     summary: Menghapus data mahasiswa berdasarkan ID
 *     tags: [Mahasiswa]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID mahasiswa
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mahasiswa berhasil dihapus
 *       404:
 *         description: Mahasiswa tidak ditemukan
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.delete('/delete/:id', authenticateToken, combinedRoleCheck('Admin'), deleteMahasiswa);

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/addmahasiswakondisi:
 *   post:
 *     summary: Menambahkan data mahasiswa dengan kondisi tertentu
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mahasiswa'
 *     responses:
 *       201:
 *         description: Data mahasiswa berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.post('/addmahasiswakondisi', authenticateTokenMahasiswa, combinedRoleCheck('Mahasiswa'), addMahasiswaKondisi);


/**
 * @swagger
 * tags:
 *   name: Mahasiswa
 *   description: API untuk mengelola data mahasiswa
 */

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/login:
 *   post:
 *     summary: Login mahasiswa
 *     tags: [Mahasiswa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Login gagal
 */
MahasiswaRoutes.post('/login', login)


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/addkondisi:
 *   post:
 *     summary: Menambahkan kondisi untuk mahasiswa
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kondisi:
 *                 type: string
 *                 example: "64e5b8f4861bcc3c8128d126"
 *             required:
 *               - kondisi
 *     responses:
 *       201:
 *         description: Kondisi berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.post('/addkondisi', authenticateToken, combinedRoleCheck('Mahasiswa'), add);


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/get/kondisi:
 *   post:
 *     summary: mengambil kondisi untuk mahasiswa
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kondisi:
 *                 type: string
 *                 example: "64e5b8f4861bcc3c8128d126"
 *             required:
 *               - kondisi
 *     responses:
 *       201:
 *         description: Kondisi berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/get/kondisi', getKondisi)

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/tahun_lulusan/add:
 *   post:
 *     summary: Menambahkan tahun kelulusan secara manual
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tahun:
 *                 type: number
 *                 example: 2024
 *             required:
 *               - tahun
 *     responses:
 *       201:
 *         description: Tahun kelulusan berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.post('/tahun_lulusan/add', authenticateToken, combinedRoleCheck('Mahasiswa'), addTahunLulusManualy);



/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/tahun_lulusan/all:
 *   get:
 *     summary: Mendapatkan semua data tahun kelulusan
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua tahun kelulusan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d125"
 *                   tahun:
 *                     type: number
 *                     example: 2024
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/tahun_lulusan/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getTahunLulus);


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/tracer_mahasiswa/all:
 *   get:
 *     summary: Mendapatkan semua data Tracer Study yang akan diisi oleh Mahasiswa
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mendapatkan semua data Tracer Study yang akan diisi oleh Mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/tracer_mahasiswa/all', authenticateTokenMahasiswa, checkMahasiswaRole, getTracerMahasiswa)

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/soal_mahasiswa/{id}:
 *   get:
 *     summary: Mendapatkan semua data Soal yang akan diisi oleh Mahasiswa berdasarkan id mahasiswa
 *     tags: [Mahasiswa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mendapatkan semua data Tracer Study yang akan diisi oleh Mahasiswa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/soal_mahasiswa/:id', authenticateTokenMahasiswa, checkMahasiswaRole, getSoalToMahasiswa)


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/submit:
 *   post:
 *     summary: Mengirim Jawaban dari Mahasiswa
 *     tags: 
 *       - Mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jawaban:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_soal:
 *                       type: string
 *                       example: "id1"
 *                     jawaban:
 *                       type: string
 *                       example: "Sangat Setuju"
 *                     bobot_jawaban:
 *                       type: number
 *                       example: 5
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jawaban Saved"
 *                 data:
 *                   type: object
 *       401:
 *         description: Akses tidak diizinkan
 */

MahasiswaRoutes.post('/submit', authenticateTokenMahasiswa, checkMahasiswaRole, handleJawabanAndCalculateScores)

/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/tracer/coming:
 *   post:
 *     summary: Mengambil data Tracer yang akan datang
 *     tags: 
 *       - Mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jawaban:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_soal:
 *                       type: string
 *                       example: "id1"
 *                     jawaban:
 *                       type: string
 *                       example: "Sangat Setuju"
 *                     bobot_jawaban:
 *                       type: number
 *                       example: 5
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jawaban Saved"
 *                 data:
 *                   type: object
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/tracer/coming', authenticateTokenMahasiswa, checkMahasiswaRole, getTracerForComming )


/**
 * @swagger
 * http://192.168.18.176:5000/mahasiswa/tracer/done:
 *   post:
 *     summary: Mengambil Tracer yang sudah berakhir
 *     tags: 
 *       - Mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jawaban:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_soal:
 *                       type: string
 *                       example: "id1"
 *                     jawaban:
 *                       type: string
 *                       example: "Sangat Setuju"
 *                     bobot_jawaban:
 *                       type: number
 *                       example: 5
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jawaban Saved"
 *                 data:
 *                   type: object
 *       401:
 *         description: Akses tidak diizinkan
 */
MahasiswaRoutes.get('/tracer/done', authenticateTokenMahasiswa, checkMahasiswaRole, getTracerForBerakhir )
module.exports = MahasiswaRoutes

// authenticateTokenMahasiswa, combinedRoleCheck('Admin'), 