const express = require('express')
const { getAll, createUser, editUser, deleteUser, searchUser, userById } = require('../Controllers/UserController')
const { addRole, getRole, getRoleUmum, getRoleForAdmin, getRoleForKaprodi } = require('../Controllers/RoleController')
const { login, forgotPassword } = require('../Controllers/AuthUserController')
const { authenticateToken, refreshTokenHandler, revokeToken } = require('../Middleware/AuthenticateMiddleware')
const { combinedRoleCheck } = require('../Middleware/CheckRoleMiddleware')


const UserRouter = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Pengguna:
 *       type: object
 *       required:
 *         - avatar
 *         - nama
 *         - nip
 *         - jabatan
 *         - pendidikan
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk pengguna
 *           example: "64e5b8f4861bcc3c8128d125"
 *         avatar:
 *           type: string
 *           description: URL untuk avatar pengguna
 *           example: "https://example.com/avatar.jpg"
 *         nama:
 *           type: string
 *           description: Nama lengkap pengguna
 *           example: "John Doe"
 *         nip:
 *           type: number
 *           description: Nomor Induk Pegawai
 *           example: 123456789
 *         jabatan:
 *           type: string
 *           description: Jabatan pengguna
 *           example: "Manager"
 *         pendidikan:
 *           type: string
 *           description: Pendidikan pengguna
 *           example: "S1"
 *         tentang:
 *           type: string
 *           description: Deskripsi atau bio pengguna
 *           example: "Seorang profesional di bidang IT."
 *         email:
 *           type: string
 *           description: Alamat email pengguna
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           description: Kata sandi pengguna
 *           example: "password123"
 *         is_active:
 *           type: boolean
 *           description: Status aktif pengguna
 *           example: true
 *         not_delete:
 *           type: boolean
 *           description: Status penghapusan data
 *           example: true
 *         roleId:
 *           type: string
 *           description: Referensi ID role pengguna
 *           example: "64e5b8f4861bcc3c8128d126"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal saat pengguna dibuat
 *           example: "2024-11-25T07:21:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal saat pengguna terakhir diperbarui
 *           example: "2024-11-25T07:21:00.000Z"
 *         passwordResetToken:
 *           type: string
 *           description: Token reset password
 *           example: "abc123xyz"
 *         passwordResetExpires:
 *           type: string
 *           format: date-time
 *           description: Waktu kadaluarsa token reset password
 *           example: "2024-11-25T07:21:00.000Z"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Pengguna:
 *       type: object
 *       required:
 *         - avatar
 *         - nama
 *         - nip
 *         - jabatan
 *         - pendidikan
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unik untuk pengguna
 *           example: "64e5b8f4861bcc3c8128d125"
 *         avatar:
 *           type: string
 *           description: URL untuk avatar pengguna
 *           example: "https://example.com/avatar.jpg"
 *         nama:
 *           type: string
 *           description: Nama lengkap pengguna
 *           example: "John Doe"
 *         nip:
 *           type: number
 *           description: Nomor Induk Pegawai
 *           example: 123456789
 *         jabatan:
 *           type: string
 *           description: Jabatan pengguna
 *           example: "Manager"
 *         pendidikan:
 *           type: string
 *           description: Pendidikan pengguna
 *           example: "S1"
 *         tentang:
 *           type: string
 *           description: Deskripsi atau bio pengguna
 *           example: "Seorang profesional di bidang IT."
 *         email:
 *           type: string
 *           description: Alamat email pengguna
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           description: Kata sandi pengguna
 *           example: "password123"
 *         is_active:
 *           type: boolean
 *           description: Status aktif pengguna
 *           example: true
 *         not_delete:
 *           type: boolean
 *           description: Status penghapusan data
 *           example: true
 *         roleId:
 *           type: string
 *           description: Referensi ID role pengguna
 *           example: "64e5b8f4861bcc3c8128d126"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal saat pengguna dibuat
 *           example: "2024-11-25T07:21:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Tanggal saat pengguna terakhir diperbarui
 *           example: "2024-11-25T07:21:00.000Z"
 *         passwordResetToken:
 *           type: string
 *           description: Token reset password
 *           example: "abc123xyz"
 *         passwordResetExpires:
 *           type: string
 *           format: date-time
 *           description: Waktu kadaluarsa token reset password
 *           example: "2024-11-25T07:21:00.000Z"
 */
UserRouter.get('/all', getAll)
// UserRouter.get('/searchuser', searchUser)

/**
 * @swagger
 * http://192.168.18.176:5000/users/adduser:
 *   post:
 *     summary: Menambahkan pengguna baru
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pengguna'
 *     responses:
 *       201:
 *         description: Pengguna berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
UserRouter.post('/adduser', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), createUser)


/**
 * @swagger
 * http://192.168.18.176:5000/users/{id}:
 *   get:
 *     summary: Mendapatkan data pengguna berdasarkan ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pengguna'
 *       404:
 *         description: Pengguna tidak ditemukan
 */
UserRouter.get('/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), userById)

/**
 * @swagger
 * http://192.168.18.176:5000/users/edituser/{id}:
 *   put:
 *     summary: Mengedit data pengguna
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pengguna'
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diperbarui
 *       404:
 *         description: Pengguna tidak ditemukan
 */
UserRouter.put('/edituser/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), editUser)

/**
 * @swagger
 * http://192.168.18.176:5000/users/deleteuser/{id}:
 *   delete:
 *     summary: Menghapus data pengguna
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pengguna
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna berhasil dihapus
 *       404:
 *         description: Pengguna tidak ditemukan
 */
UserRouter.delete('/deleteuser/:id', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), deleteUser)


/**
 * @swagger
 * http://192.168.18.176:5000/users/login:
 *   post:
 *     summary: Melakukan login untuk pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Kredensial salah
 */
UserRouter.post('/login', login)

/**
 * @swagger
 * http://192.168.18.176:5000/users/forgot-password:
 *   post:
 *     summary: Melakukan reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Email reset password terkirim
 *       404:
 *         description: Email tidak ditemukan
 */
UserRouter.post('/forgot-password', forgotPassword)



/**
 * @swagger
 * http://192.168.18.176:5000/users/refresh:
 *   post:
 *     summary: Menggunakan token refresh
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refresh berhasil
 *       400:
 *         description: Token invalid
 */
UserRouter.post('/refresh', refreshTokenHandler)


// UserRouter.get('/role/all', authenticateToken, combinedRoleCheck('Admin', 'Super Admin'), getRole)


/**
 * @swagger
 * http://192.168.18.176:5000/users/logout:
 *   post:
 *     summary: Logout User
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout User Succesfull
 *       400:
 *         description: Failed Logout
 */
UserRouter.post('/logout', revokeToken)




module.exports = UserRouter

