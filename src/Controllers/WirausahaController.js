const Wirausaha = require('../Models/BigData/MasterDataWirausaha')

exports.addDataWirausaha = async (req, res) => {
    try {
        const data = req.body
        if (!data) return res.status(400).json({ message : "Data require"})
        
        const wirausaha = new Wirausaha(data)
        await wirausaha.save()

        return res.status(200).json({
            message : "Succesfully add Data",
            data : wirausaha
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable add Data",
            error : error.message
        })
    }
}

exports.getWirausaha = async (req, res) => {
    try {
        const wirausaha = await Wirausaha.find()
        if (!wirausaha) return res.status(404).json({ message : "Data not Found"})

         
         const result = wirausaha.map(item => {
            return item.wirausaha.map(bidang => ({
                namaBidang: bidang.namaBidang,
                kategoriWirausaha: bidang.jenisWirausaha.map(wirausaha => wirausaha.kategori),
                jenisWirausaha : bidang.jenisWirausaha.map(wirausaha => wirausaha.jenis)
            }));
        }).flat();

        return res.status(200).json({
            message : "Succesfully get Data",
            data : result
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable get Data",
            error : error.message
        })
    }
}

exports.getDataBidang = async (req, res) => {
    try {
        const wirausaha = await Wirausaha.find()
        if (!wirausaha) return res.status(404).json({ message : "Data not Found"})

        const result = wirausaha.map(item => {
            return item.wirausaha.flatMap(bidang => bidang.namaBidang);
        }).flat();

        
        const uniqueResult = [...new Set(result)];

        return res.status(200).json({
            message : "Succesfully get Data",
            data : uniqueResult
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable get Data",
            error : error.message
        })
    }
}

exports.getDataKategori = async (req, res) => {
    try {
        const wirausaha = await Wirausaha.find()
        if (!wirausaha) return res.status(404).json({ message : "Data not Found"})

         
        const result = wirausaha.map(item => {
            return item.wirausaha.flatMap(bidang => 
                bidang.jenisWirausaha.flatMap(wirausaha => wirausaha.kategori)
            );
        }).flat();

        return res.status(200).json({
            message : "Succesfully get Data",
            data : result
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable get Data",
            error : error.message
        })
    }
}

exports.getDataJenis = async (req, res) => {
    try {
        const wirausaha = await Wirausaha.find()
        if (!wirausaha) return res.status(404).json({ message : "Data not Found"})

         
        const result = wirausaha.map(item => {
            return item.wirausaha.flatMap(bidang => 
                bidang.jenisWirausaha.flatMap(wirausaha => wirausaha.jenis)
            );
        }).flat();
    

        return res.status(200).json({
            message : "Succesfully get Data",
            data : result
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable get Data",
            error : error.message
        })
    }
}