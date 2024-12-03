const KondisiModel = require('../Models/BigData/KondisiModel')
const DataPekerjaan = require('../Models/BigData/MasterDataPekerjaanModel')

exports.addDataPekerjaan = async (req, res) => {
    try {
        const data = req.body
        if (!data) return res.status(400).json({ message : "Data Required"})
        
        const pekerjaan = new DataPekerjaan(data)
        await pekerjaan.save()

        if(!pekerjaan) return res.status(400).json({ message : "Failed Add Data"})

        return res.status(200).json({ message : "Succesfully add Data", data : pekerjaan})
    } catch (error) {
        return res.status(500).json({ message : "Unable add Data"})
    }
}

exports.getDataPekerjaan = async (req, res) => {
    try {
        const pekerjaan = await DataPekerjaan.find()
        if (!pekerjaan) return res.status(404).json({ message : "Data not Found"})

         
        //  const result = pekerjaan.map(item => {
        //     return item.pekerjaan.map(bidang => ({
        //         namaBidang: bidang.namaBidang,
        //         jenisPekerjaan: bidang.jenisPekerjaan.map(pekerjaan => pekerjaan.jenis),
        //         posisiPekerjaan : bidang.jenisPekerjaan.map(pekerjaan => pekerjaan.posisi)
        //     }));
        // }).flat();

        return res.status(200).json({
            message : "Succesfully get Data",
            data : pekerjaan
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
        const pekerjaan = await DataPekerjaan.find()
        if (!pekerjaan) return res.status(404).json({ message : "Data not Found"})

        const result = pekerjaan.map(item => {
            return item.pekerjaan.flatMap(bidang => bidang.namaBidang);
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

exports.getDataJenis = async (req, res) => {
    try {
        const pekerjaan = await DataPekerjaan.find()
        if (!pekerjaan) return res.status(404).json({ message : "Data not Found"})

         
        const result = pekerjaan.map(item => {
            return item.pekerjaan.flatMap(bidang => 
                bidang.jenisPekerjaan.flatMap(pekerjaan => pekerjaan.jenis)
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

exports.getDataPosisi = async (req, res) => {
    try {
        const pekerjaan = await DataPekerjaan.find()
        if (!pekerjaan) return res.status(404).json({ message : "Data not Found"})

         
        const result = pekerjaan.map(item => {
            return item.pekerjaan.flatMap(bidang => 
                bidang.jenisPekerjaan.flatMap(pekerjaan => pekerjaan.posisi)
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



exports.getKondisi = async ( req, res) => {
    try {
        const kondisi = await KondisiModel.find()

        if(!kondisi){
            console.log("Not Found");
            return res.status(404).json({message : "Not Found"})
        }
        return res.status(200).json({
            message : "Succesfully get Kondisi",
            data : kondisi
        })
    } catch (error) {
        console.log("Unable :", error);
        return res.status(500).json({message : "Unable", error : error.message})
    }
}