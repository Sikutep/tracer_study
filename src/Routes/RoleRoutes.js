const express = require('express')
const { getRoleForAdmin, getRoleForKaprodi, addRole, getRoleUmum, getRole } = require('../Controllers/RoleController')


const RoleRoutes = express.Router()



/**
 * @swagger
 * http://192.168.18.176:5000/role/add:
 *   post:
 *     summary: Menambahkan role untuk pengguna
 *     tags: [Role]
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
 *                 example: "Admin"
 *     responses:
 *       201:
 *         description: Role berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
RoleRoutes.post('/add',  addRole)



/**
 * @swagger
 * /role/role_umum:
 *   get:
 *     summary: Mendapatkan daftar role umum (kecuali Mahasiswa)
 *     tags:
 *       - Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role umum berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully get Role (excluding Mahasiswa)"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "672d79e7861bcc3c8128d857"
 *                       role:
 *                         type: string
 *                         example: "Admin"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       404:
 *         description: Role umum tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data Role not Found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to get roles"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

RoleRoutes.get('/role_umum', getRoleUmum)

/**
 * @swagger
 * http://192.168.18.176:5000/users/role/all:
 *   get:
 *     summary: Mendapatkan semua role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua role
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
 *                   nama:
 *                     type: string
 *                     example: "Super Admin"
 */



/**
 * @swagger
 * /role_admin:
 *   get:
 *     summary: Mendapatkan daftar role untuk admin
 *     tags:
 *       - Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar role berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully get Role"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "672d79e7861bcc3c8128d857"
 *                       role:
 *                         type: string
 *                         example: "Admin"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       404:
 *         description: Role tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 * 
 
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data Role not Found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to get roles"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
RoleRoutes.get('/role_admin', getRoleForAdmin)


/**
 * @swagger
 * /role_kaprodi:
 *   get:
 *     summary: Mendapatkan daftar role untuk Kaprodi
 *     tags:
 *       - Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar role berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully retrieved roles"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "674e62f8f5ec685dda71a9b4"
 *                       role:
 *                         type: string
 *                         example: "Kaprodi"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       404:
 *         description: Role tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data Role not Found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to get roles"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
RoleRoutes.get('/role_kaprodi', getRoleForKaprodi)

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Mendapatkan semua role yang tersedia
 *     tags:
 *       - Role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar role berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully get Role"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "672d79e1861bcc3c8128d855"
 *                       role:
 *                         type: string
 *                         example: "Super Admin"
 *                       __v:
 *                         type: number
 *                         example: 0
 *       404:
 *         description: Tidak ada role yang ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data Role not Found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to get roles"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
RoleRoutes.get('/all', getRole)

module.exports = RoleRoutes