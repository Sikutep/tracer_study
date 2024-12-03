const express = require('express')

const {getAll, addKampus, editKampus, deleteKampus, getByIdKampus} = require('../Controllers/KampusController') 
const { authenticateToken } = require('../Middleware/AuthenticateMiddleware')
const { combinedRoleCheck } = require('../Middleware/CheckRoleMiddleware')

const KampusRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Kampus
 *   description: API untuk mengelola data kampus
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Kampus:
 *       type: object
 *       required:
 *         - kode_pt
 *         - tanggal_berdiri
 *         - tanggal_sk
 *         - alamat
 *         - psdku
 *         - akreditasi
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik kampus
 *           example: "64e5b8f4861bcc3c8128d125"
 *         kode_pt:
 *           type: number
 *           description: Kode Perguruan Tinggi
 *           example: 123456
 *         banner:
 *           type: string
 *           description: Path gambar banner kampus
 *           example: "/path/to/banner.jpg"
 *         avatar:
 *           type: string
 *           description: Path gambar avatar kampus
 *           example: "/path/to/avatar.jpg"
 *         tanggal_berdiri:
 *           type: string
 *           format: date
 *           description: Tanggal berdirinya kampus
 *           example: "1995-06-17"
 *         tanggal_sk:
 *           type: string
 *           description: Tanggal SK kampus
 *           example: "1996-01-01"
 *         alamat:
 *           type: string
 *           description: Alamat lengkap kampus
 *           example: "Jalan Raya No. 123, Jakarta"
 *         psdku:
 *           type: string
 *           description: PSDKU kampus
 *           example: "LP3I Tasikmalaya"
 *         prodi:
 *           type: array
 *           description: Daftar program studi yang tersedia di kampus
 *           items:
 *             type: string
 *             example: "64e5b8f4861bcc3c8128d122"
 *         pengguna:
 *           type: array
 *           description: Daftar pengguna yang terhubung dengan kampus
 *           items:
 *             type: string
 *             example: "64e5b8f4861bcc3c8128d123"
 *         akreditasi:
 *           type: string
 *           description: ID akreditasi kampus
 *           example: "64e5b8f4861bcc3c8128d124"
 *         status:
 *           type: string
 *           enum: ["Aktif", "Non Aktif"]
 *           description: Status aktif/non aktif kampus
 *           example: "Aktif"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data kampus dibuat
 *           example: "2024-11-25T07:21:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal data kampus terakhir diperbarui
 *           example: "2024-11-25T07:21:00.000Z"
 *         not_delete:
 *           type: boolean
 *           description: Menandakan apakah kampus dapat dihapus atau tidak
 *           example: true
 */




/**
 * @swagger
 * http://192.168.18.176:5000/kampus/all:
 *   get:
 *     summary: Mendapatkan semua data kampus
 *     tags: [Kampus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar kampus
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
 *                   kode_pt:
 *                     type: number
 *                     example: 123456
 *                   banner:
 *                     type: string
 *                     example: "/path/to/banner.jpg"
 *                   avatar:
 *                     type: string
 *                     example: "/path/to/avatar.jpg"
 *                   tanggal_berdiri:
 *                     type: string
 *                     format: date
 *                     example: "1995-06-17"
 *                   tanggal_sk:
 *                     type: string
 *                     example: "1996-01-01"
 *                   alamat:
 *                     type: string
 *                     example: "Jalan Raya No. 123, Jakarta"
 *                   psdku:
 *                     type: string
 *                     example: "LP3I Tasikmalaya"
 *                   prodi:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "64e5b8f4861bcc3c8128d122"
 *                   pengguna:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "64e5b8f4861bcc3c8128d123"
 *                   akreditasi:
 *                     type: string
 *                     example: "64e5b8f4861bcc3c8128d124"
 *                   status:
 *                     type: string
 *                     enum: ["Aktif", "Non Aktif"]
 *                     example: "Aktif"
 *                   createdAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2024-11-25T07:21:00.000Z"
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Akses ditolak
 */
KampusRoutes.get('/all', authenticateToken, combinedRoleCheck('Super Admin', 'Admin'), getAll)


/**
 * @swagger
 * http://192.168.18.176:5000/kampus/{id}:
 *   get:
 *     summary: Mendapatkan data kampus berdasarkan ID
 *     tags: [Kampus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kampus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data kampus ditemukan
 *       404:
 *         description: Kampus tidak ditemukan
 */
KampusRoutes.get('/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getByIdKampus)

/**
 * @swagger
 * http://192.168.18.176:5000/kampus/add:
 *   post:
 *     summary: Menambahkan data kampus baru
 *     tags: [Kampus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode_pt:
 *                 type: number
 *                 example: 123456
 *               banner:
 *                 type: string
 *                 example: "/path/to/banner.jpg"
 *               avatar:
 *                 type: string
 *                 example: "/path/to/avatar.jpg"
 *               tanggal_berdiri:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-17"
 *               tanggal_sk:
 *                 type: string
 *                 example: "1996-01-01"
 *               alamat:
 *                 type: string
 *                 example: "Jalan Raya No. 123, Jakarta"
 *               psdku:
 *                 type: string
 *                 example: "LP3I Tasikmalaya"
 *               akreditasi:
 *                 type: string
 *                 example: "64e5b8f4861bcc3c8128d124"
 *             required:
 *               - kode_pt
 *               - tanggal_berdiri
 *               - tanggal_sk
 *               - alamat
 *               - psdku
 *               - akreditasi
 *     responses:
 *       201:
 *         description: Kampus berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
KampusRoutes.post('/add', authenticateToken, combinedRoleCheck('Super Admin'), addKampus)

/**
 * @swagger
 * http://192.168.18.176:5000/kampus/edit/{id}:
 *   put:
 *     summary: Mengedit data kampus berdasarkan ID
 *     tags: [Kampus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kampus yang ingin diedit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banner:
 *                 type: string
 *                 example: "/path/to/banner.jpg"
 *               avatar:
 *                 type: string
 *                 example: "/path/to/avatar.jpg"
 *               alamat:
 *                 type: string
 *                 example: "Jalan Baru No. 45, Bandung"
 *               status:
 *                 type: string
 *                 enum: ["Aktif", "Non Aktif"]
 *                 example: "Aktif"
 *     responses:
 *       200:
 *         description: Kampus berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Kampus tidak ditemukan
 */
KampusRoutes.put('/edit/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), editKampus)

/**
 * @swagger
 * http://192.168.18.176:5000/kampus/delete/{id}:
 *   delete:
 *     summary: Menghapus data kampus berdasarkan ID
 *     tags: [Kampus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID kampus yang ingin dihapus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kampus berhasil dihapus
 *       404:
 *         description: Kampus tidak ditemukan
 */
KampusRoutes.delete('/delete/:id', authenticateToken, combinedRoleCheck('Super Admin'), deleteKampus)

module.exports = KampusRoutes