const PusatBantuan = require('../Models/PusatBantuanModel')
const Reply = require('../Models/PusatBantuanReplyModel')
const nodemailer = require('nodemailer')

exports.getPusatBantuan = async (req, res) => {
   try {
        const data = await PusatBantuan.find()
        if (!data) return res.status(404).json({ message : "Data Pusat Bantuan not Found"})
        return res.status(200).json({
            message : "Succesfully get Data",
            data : data
        })
   } catch (error) {
        return res.status(500).json({
            message: "Unable get Data",
            error : error.message
        })
   }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.id
        const databantuan = await PusatBantuan.findById(id)
        if (!databantuan) return res.status(404).json({ message : "Data not Found"})
        return res.status(200).json({
            message : "Succesfully get Data",
            data : databantuan
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable to get",
            error : error.message
        })
    }
}

exports.sendPusatBantuan = async (req, res) => {
   try {
        const { nama, email, judul, deskripsi} = req.body
        const data = { nama, email, judul, deskripsi}
        if (!data) return res.status(400).json({ message: "Data required"})
        const bantuan = new PusatBantuan(data)
        await bantuan.save()
        return res.status(200).json({
            message : "Succesfully add Data",
            data : bantuan
        })
   } catch (error) {
        return res.status(500).json({
            message: "Unable add Data",
            error : error.message
        })
   }

}


exports.getRepliesByPusatBantuanId = async (req, res) => {
    try {
        const { id } = req.params
        const replies = await Reply.find({ pusatBantuanId: id })
        if (!replies || replies.length === 0) return res.status(404).json({ message: "No replies found" })

        return res.status(200).json({
            message: "Successfully retrieved replies",
            data: replies
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve replies",
            error: error.message
        })
    }
}



exports.replyPusatBantuan = async (req, res) => {
    try {
        const { id } = req.params
        const { replyMessage } = req.body

        
        const bantuan = await PusatBantuan.findById(id)
        if (!bantuan) return res.status(404).json({ message: "Data Pusat Bantuan not found" })

        
        const replyData = new Reply({
            pusatBantuanId: id,
            replyMessage
        })
        await replyData.save()

        bantuan.status = 'Selesai'
        await bantuan.save()

        // Konfigurasi Nodemailer untuk mengirim email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email-anda@gmail.com',
                pass: 'password-email-anda'
            }
        })

        // Konfigurasi email
        const mailOptions = {
            from: 'email-anda@gmail.com',
            to: bantuan.email,
            subject: `Balasan untuk: ${bantuan.judul}`,
            text: `Halo ${bantuan.nama},\n\n${replyMessage}\n\nTerima kasih telah menghubungi pusat bantuan kami.\nSalam,\nTim Bantuan`
        }

        // Kirim email balasan
        await transporter.sendMail(mailOptions)

        // Berikan respons sukses
        return res.status(200).json({
            message: "Succesfully replied and sent email",
            data: replyData
        })

    } catch (error) {
        return res.status(500).json({
            message: "Unable to send reply",
            error: error.message
        })
    }
}