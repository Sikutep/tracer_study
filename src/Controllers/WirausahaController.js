const Bidang = require('../Models/BigData/Wirausaha/BidangUsahaModel')
const Jenis = require('../Models/BigData/Wirausaha/JenisUsahaModel')
const Kategori = require('../Models/BigData/Wirausaha/KategoriUsahaModel')


exports.addBidang = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(404).json({
            message: "Data Required"
        })

        const bidang = new Bidang(data)
        await bidang.save()

        return res.status(200).json({
            data : bidang
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message : "Unable to add Bidang",
            error : error
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
        console.log(error)
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