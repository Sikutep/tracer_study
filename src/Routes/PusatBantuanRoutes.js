const express = require('express')

const { getPusatBantuan, getById, sendPusatBantuan, replyPusatBantuan } = require('../Controllers/PusatBantuanController')

const PusatBantuanRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: PusatBantuan
 *   description: API untuk mengelola pusat bantuan dan balasannya
 */

/**
 * @swagger
 * /pusat-bantuan/all:
 *   get:
 *     summary: Mendapatkan semua data pusat bantuan
 *     tags: [PusatBantuan]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data pusat bantuan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PusatBantuan'
 */
PusatBantuanRoutes.get('/all', getPusatBantuan)

/**
 * @swagger
 * http://192.168.18.176:5000/pusat-bantuan/{id}:
 *   get:
 *     summary: Mendapatkan data pusat bantuan berdasarkan ID
 *     tags: [PusatBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari pusat bantuan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pusat bantuan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PusatBantuan'
 *       404:
 *         description: Data tidak ditemukan
 */
PusatBantuanRoutes.get('/:id', getById)


/**
 * @swagger
 * http://192.168.18.176:5000/pusat-bantuan/replies/{id}:
 *   get:
 *     summary: Mendapatkan semua balasan untuk pusat bantuan tertentu
 *     tags: [PusatBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari pusat bantuan
 *     responses:
 *       200:
 *         description: Berhasil mengambil balasan pusat bantuan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PusatBantuanReply'
 */
PusatBantuanRoutes.get('/replies/:id', getPusatBantuan)

/**
 * @swagger
 * http://192.168.18.176:5000/pusat-bantuan/send:
 *   post:
 *     summary: Mengirim data pusat bantuan baru
 *     tags: [PusatBantuan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama pengirim
 *               email:
 *                 type: string
 *                 description: Email pengirim
 *               judul:
 *                 type: string
 *                 description: Judul pesan
 *               Deskripsi:
 *                 type: string
 *                 description: Deskripsi pesan
 *     responses:
 *       201:
 *         description: Data pusat bantuan berhasil dikirim
 *       400:
 *         description: Data tidak valid
 */
PusatBantuanRoutes.post('/send', sendPusatBantuan)


/**
 * @swagger
 * http://192.168.18.176:5000/pusat-bantuan/reply/{id}:
 *   post:
 *     summary: Membalas pesan pusat bantuan
 *     tags: [PusatBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID dari pusat bantuan yang ingin dibalas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply_message:
 *                 type: string
 *                 description: Pesan balasan
 *     responses:
 *       201:
 *         description: Balasan berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 *       404:
 *         description: Data pusat bantuan tidak ditemukan
 */
PusatBantuanRoutes.post('/reply/:id', replyPusatBantuan)

/**
 * @swagger
 * components:
 *   schemas:
 *     PusatBantuan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID pusat bantuan
 *         nama:
 *           type: string
 *           description: Nama pengirim
 *         email:
 *           type: string
 *           description: Email pengirim
 *         judul:
 *           type: string
 *           description: Judul pesan
 *         Deskripsi:
 *           type: string
 *           description: Deskripsi pesan
 *         status:
 *           type: string
 *           enum:
 *             - Terbaru
 *             - Diproses
 *             - Selesai
 *           description: Status pesan
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu pembuatan pesan
 *
 *     PusatBantuanReply:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID balasan
 *         pusat_bantuan_id:
 *           type: string
 *           description: ID dari pusat bantuan terkait
 *         reply_message:
 *           type: string
 *           description: Pesan balasan
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Waktu balasan dibuat
 */


module.exports = PusatBantuanRoutes