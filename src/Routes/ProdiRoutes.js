const express = require('express')

const { getAll, createProdi, getById, editProdi, deleteProdi, addAkreditasi, getAkreditasi } = require('../Controllers/ProdiController')
const { addJenjang, getJenjang } = require('../Controllers/JenjangController')
const { authenticateToken } = require('../Middleware/AuthenticateMiddleware')
const { combinedRoleCheck } = require('../Middleware/CheckRoleMiddleware')

const prodiRoute = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Prodi:
 *       type: object
 *       required:
 *         - kode
 *         - nama
 *         - jenjang
 *         - akreditasi
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk program studi
 *           example: "64e5b8f4861bcc3c8128d125"
 *         kode:
 *           type: string
 *           description: Kode program studi
 *           example: "AB01"
 *         nama:
 *           type: string
 *           description: Nama program studi
 *           example: "Administrasi Bisnis"
 *         jenjang:
 *           type: string
 *           description: ID referensi jenjang pendidikan
 *           example: "64e5b8f4861bcc3c8128d126"
 *         akreditasi:
 *           type: string
 *           description: ID referensi akreditasi
 *           example: "64e5b8f4861bcc3c8128d127"
 *         status:
 *           type: string
 *           enum: ["Aktif", "Non Aktif"]
 *           description: Status aktif/non-aktif program studi
 *           example: "Aktif"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data dibuat
 *           example: "2024-11-25T07:21:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data terakhir diperbarui
 *           example: "2024-11-25T07:21:00.000Z"
 *         not_delete:
 *           type: boolean
 *           description: Menandakan apakah data dapat dihapus
 *           example: true
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Prodi:
 *       type: object
 *       required:
 *         - kode
 *         - nama
 *         - jenjang
 *         - akreditasi
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk program studi
 *           example: "64e5b8f4861bcc3c8128d125"
 *         kode:
 *           type: string
 *           description: Kode program studi
 *           example: "AB01"
 *         nama:
 *           type: string
 *           description: Nama program studi
 *           example: "Administrasi Bisnis"
 *         jenjang:
 *           type: string
 *           description: ID referensi jenjang pendidikan
 *           example: "64e5b8f4861bcc3c8128d126"
 *         akreditasi:
 *           type: string
 *           description: ID referensi akreditasi
 *           example: "64e5b8f4861bcc3c8128d127"
 *         status:
 *           type: string
 *           enum: ["Aktif", "Non Aktif"]
 *           description: Status aktif/non-aktif program studi
 *           example: "Aktif"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data dibuat
 *           example: "2024-11-25T07:21:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data terakhir diperbarui
 *           example: "2024-11-25T07:21:00.000Z"
 *         not_delete:
 *           type: boolean
 *           description: Menandakan apakah data dapat dihapus
 *           example: true
 */
prodiRoute.get('/all',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getAll)


/**
 * @swagger
 * http://192.168.18.176:5000/prodi/{id}:
 *   get:
 *     summary: Mendapatkan data Prodi berdasarkan ID
 *     tags: [Prodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Prodi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data Prodi ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prodi'
 *       404:
 *         description: Prodi tidak ditemukan
 */
prodiRoute.get('/:id',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getById)


/**
 * @swagger
 * http://192.168.18.176:5000/prodi/add:
 *   post:
 *     summary: Menambahkan data Prodi baru
 *     tags: [Prodi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prodi'
 *     responses:
 *       201:
 *         description: Data Prodi berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
prodiRoute.post('/add',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), createProdi)

/**
 * @swagger
 * http://192.168.18.176:5000/prodi/edit/{id}:
 *   put:
 *     summary: Mengedit data Prodi
 *     tags: [Prodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Prodi
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prodi'
 *     responses:
 *       200:
 *         description: Data Prodi berhasil diperbarui
 *       404:
 *         description: Prodi tidak ditemukan
 */
prodiRoute.put('/edit/:id',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), editProdi)

/**
 * @swagger
 * http://192.168.18.176:5000/prodi/delete/{id}:
 *   delete:
 *     summary: Menghapus data Prodi
 *     tags: [Prodi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID Prodi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data Prodi berhasil dihapus
 *       404:
 *         description: Prodi tidak ditemukan
 */
prodiRoute.delete('/delete/:id',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), deleteProdi)

/**
 * @swagger
 * http://192.168.18.176:5000/prodi/addjenjang:
 *   post:
 *     summary: Menambahkan data Jenjang baru
 *     tags: [Jenjang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "D4"
 *     responses:
 *       201:
 *         description: Data Jenjang berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
prodiRoute.post('/addjenjang',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addJenjang)

/**
 * @swagger
 * http://192.168.18.176:5000/prodi/jenjang/all:
 *   get:
 *     summary: Mendapatkan semua data Jenjang
 *     tags: [Jenjang]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua jenjang
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d128"
 *                   nama:
 *                     type: string
 *                     example: "D4"
 */
prodiRoute.get('/jenjang/all',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getJenjang)

/**
 * @swagger
 * http://192.168.18.176:5000/prodi/addakreditasi:
 *   post:
 *     summary: Menambahkan data Akreditasi baru
 *     tags: [Akreditasi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "A"
 *     responses:
 *       201:
 *         description: Data Akreditasi berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
prodiRoute.post('/addakreditasi',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), addAkreditasi)


/**
 * @swagger
 * http://192.168.18.176:5000/prodi/akreditasi/all:
 *   get:
 *     summary: Mendapatkan semua data Akreditasi
 *     tags: [Akreditasi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua akreditasi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d129"
 *                   nama:
 *                     type: string
 *                     example: "A"
 */
prodiRoute.get('/akreditasi/all',  authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getAkreditasi)

module.exports = prodiRoute