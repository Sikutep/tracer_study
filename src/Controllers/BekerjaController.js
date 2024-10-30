const Bidang = require('../Models/BigData/Bekerja/BidangPekerjaanModel')
const Jenis = require('../Models/BigData/Bekerja/JenisPekerjaanModel')
const Kategori = require('../Models/BigData/Bekerja/KategoriPekerjaanmodel')


exports.addBidang = async (req, res) => {
    try {
        const { bidang } = req.body
        if(!bidang) return res.status(404).json({
            message: "Data Required"
        })

        const data = new Bidang(req.body)
        await data.save()

        return res.status(200).json({
            data : data
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message : "Unable to add Bidang",
            error
        })
    }
}

exports.addJenis = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(404).json({
            message: "Data Required"
        })

        const jenis = new Jenis(data)
        await jenis.save()

        return res.status(200).json({
            data : jenis
        })
    } catch (error) {
        return res.status(400).json({
            message : "Unable to add Bidang"
        })
    }
}

exports.addKategori = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(404).json({
            message: "Data Required"
        })

        const kategori = new Kategori(data)
        await kategori.save()

        return res.status(200).json({
            data : kategori
        })
    } catch (error) {
        return res.status(400).json({
            message : "Unable to add kategori"
        })
    }
}

