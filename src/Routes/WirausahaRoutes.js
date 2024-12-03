const express = require('express')
const { addDataWirausaha, getWirausaha, getDataBidang, getDataKategori, getDataJenis } = require('../Controllers/WirausahaController')

const WirausahaRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Wirausaha
 *   description: API untuk mengelola data wirausaha
 */


/**
 * @swagger
 * http://192.168.18.176:5000/wirausaha/add:
 *   post:
 *     summary: Menambahkan data wirausaha baru
 *     tags: [Wirausaha]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_prodi:
 *                 type: string
 *                 description: ID program studi yang terkait
 *               wirausaha:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     namaBidang:
 *                       type: string
 *                       description: Nama bidang wirausaha
 *                     jenisWirausaha:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           kategori:
 *                             type: string
 *                             description: Kategori wirausaha
 *                           jenis:
 *                             type: array
 *                             items:
 *                               type: string
 *                               description: Jenis wirausaha
 *     responses:
 *       201:
 *         description: Data wirausaha berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
WirausahaRoutes.post('/add', addDataWirausaha)

/**
 * @swagger
 * http://192.168.18.176:5000/wirausaha/all:
 *   get:
 *     summary: Mendapatkan semua data wirausaha
 *     tags: [Wirausaha]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data wirausaha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wirausaha'
 */
WirausahaRoutes.get('/all', getWirausaha)


/**
 * @swagger
 * http://192.168.18.176:5000/wirausaha/bidang:
 *   get:
 *     summary: Mendapatkan daftar bidang wirausaha
 *     tags: [Wirausaha]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data bidang wirausaha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
WirausahaRoutes.get('/bidang', getDataBidang)

/**
 * @swagger
 * http://192.168.18.176:5000/wirausaha/kategori:
 *   get:
 *     summary: Mendapatkan daftar kategori wirausaha
 *     tags: [Wirausaha]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data kategori wirausaha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
WirausahaRoutes.get('/kategori', getDataKategori)

/**
 * @swagger
 * http://192.168.18.176:5000/wirausaha/jenis:
 *   get:
 *     summary: Mendapatkan daftar jenis wirausaha
 *     tags: [Wirausaha]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data jenis wirausaha
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
WirausahaRoutes.get('/jenis', getDataJenis)

/**
 * @swagger
 * components:
 *   schemas:
 *     Wirausaha:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID wirausaha
 *         id_prodi:
 *           type: string
 *           description: ID program studi terkait
 *         wirausaha:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               namaBidang:
 *                 type: string
 *                 description: Nama bidang wirausaha
 *               jenisWirausaha:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     kategori:
 *                       type: string
 *                       description: Kategori wirausaha
 *                     jenis:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: Jenis wirausaha
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu data dibuat
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Waktu data terakhir diperbarui
 */

module.exports = WirausahaRoutes