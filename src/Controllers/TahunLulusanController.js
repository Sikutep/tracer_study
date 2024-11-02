
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
