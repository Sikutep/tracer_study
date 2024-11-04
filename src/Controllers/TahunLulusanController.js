
const TahunLulusan = require('../Models/BigData/TahunLulusanModel'); 

exports.addTahunLulusan = async () => {
    try {
        const lastEntry = await TahunLulusan.findOne().sort({ tahun_lulusan: -1 });
        const currentYear = new Date().getFullYear();

        
        if (!lastEntry || lastEntry.tahun_lulusan < currentYear) {
            const tahunLulusan = new TahunLulusan({ tahun_lulusan: currentYear });
            await tahunLulusan.save();
            console.log(`Tahun lulusan ${currentYear} berhasil ditambahkan`);
        } else {
            console.log(`Tahun lulusan ${currentYear} sudah ada, tidak perlu ditambahkan.`);
        }
    } catch (error) {
        console.error("Gagal menambahkan tahun lulusan:", error);
    }
};

exports.addTahunLulusManualy = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(401).json({ message : "Data is Required"})
        const tahun = new TahunLulusan(data)
        await tahun.save()
        if(!tahun) return res.status(400).json({ message : "Failed add Data"})
        return res.status(200).json({ message: "Succesfully Added"})
    } catch (error) {
        return res.status(500).json({
            message : "Failed added",
            data : error.message
        })
    }
}