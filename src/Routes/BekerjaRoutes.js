const express = require('express')
const { addDataPekerjaan, getDataPekerjaan, getDataBidang, getDataJenis, getDataPosisi } = require('../Controllers/BekerjaController')

const BekerjaRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: Bekerja
 *   description: API untuk manajemen data pekerjaan
 */

/**
 * @swagger
 * http://192.168.18.176:5000/bekerja/add:
 *   post:
 *     summary: Menambahkan data pekerjaan baru
 *     tags: [Bekerja]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_prodi:
 *                 type: string
 *                 description: ID dari program studi
 *                 example: "12345"
 *               pekerjaan:
 *                 type: array
 *                 description: Daftar pekerjaan
 *                 items:
 *                   type: object
 *                   properties:
 *                     namaBidang:
 *                       type: string
 *                       description: Nama bidang pekerjaan
 *                       example: "Teknologi Informasi"
 *                     jenisPekerjaan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           jenis:
 *                             type: string
 *                             description: Jenis pekerjaan
 *                             example: "Developer"
 *                           posisi:
 *                             type: array
 *                             description: Posisi yang tersedia dalam pekerjaan
 *                             items:
 *                               type: string
 *                               description: Nama posisi
 *                               example: "Backend Developer"
 *     responses:
 *       201:
 *         description: Data pekerjaan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Pesan sukses
 *                   example: "Data pekerjaan berhasil ditambahkan"
 *                 data:
 *                   $ref: '#/components/schemas/MasterDataPekerjaan'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terotorisasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
BekerjaRouter.post('/add', addDataPekerjaan)


/**
 * @swagger
 * http://192.168.18.176:5000/bekerja/all:
 *   get:
 *     summary: Mendapatkan semua data pekerjaan
 *     tags: [Bekerja]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MasterDataPekerjaan'
 *       401:
 *         description: Tidak terotorisasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
BekerjaRouter.get('/all', getDataPekerjaan)

/**
 * @swagger
 * http://192.168.18.176:5000/bekerja/bidang:
 *   get:
 *     summary: Mendapatkan semua bidang pekerjaan
 *     tags: [Bekerja]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data bidang pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Teknologi Informasi"
 *       401:
 *         description: Tidak terotorisasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
BekerjaRouter.get('/bidang', getDataBidang)

/**
 * @swagger
 * http://192.168.18.176:5000/bekerja/jenis:
 *   get:
 *     summary: Mendapatkan semua jenis pekerjaan
 *     tags: [Bekerja]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data jenis pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Developer"
 *       401:
 *         description: Tidak terotorisasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
BekerjaRouter.get('/jenis', getDataJenis)

/**
 * @swagger
 * http://192.168.18.176:5000/bekerja/posisi:
 *   get:
 *     summary: Mendapatkan semua posisi pekerjaan
 *     tags: [Bekerja]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data posisi pekerjaan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Backend Developer"
 *       401:
 *         description: Tidak terotorisasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
BekerjaRouter.get('/posisi', getDataPosisi)

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterDataPekerjaan:
 *       type: object
 *       properties:
 *         id_prodi:
 *           type: string
 *           description: ID dari program studi
 *         pekerjaan:
 *           type: array
 *           description: Daftar pekerjaan
 *           items:
 *             type: object
 *             properties:
 *               namaBidang:
 *                 type: string
 *                 description: Nama bidang pekerjaan
 *                 example: "Teknologi Informasi"
 *               jenisPekerjaan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jenis:
 *                       type: string
 *                       description: Jenis pekerjaan
 *                       example: "Developer"
 *                     posisi:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: Posisi dalam pekerjaan
 *                         example: "Backend Developer"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan data
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu terakhir data diperbarui
 */

module.exports = BekerjaRouter


