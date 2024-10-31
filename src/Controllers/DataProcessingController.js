const Mahasiswa = require('../Models/MahasiswaModel');
const MahasiswaKondisi = require('../Models/BigData/MahasiswakondisiModel');
const Kondisi = require('../Models/BigData/KondisiModel');
const BidangWirausaha = require('../Models/BigData/Wirausaha/BidangUsahaModel');
const KategoriPekerjaan = require('../Models/BigData/Bekerja/KategoriPekerjaanmodel');
const JenisPekerjaan = require('../Models/BigData/Bekerja/JenisPekerjaanModel');
const Prodi = require('../Models/ProdiModel')


exports.totalResponden = async (req, res) => {
    try {
        const mahasiswa = await Mahasiswa.find();
        if (!mahasiswa || mahasiswa.length === 0) {
            return res.status(404).json({ message: "Total Responden Not Found" });
        }
        return res.status(200).json({
            message : "Succesfully get Total Responden",
            data : mahasiswa.length 
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Total Responden Data",
            error: error.message
        });
    }
}


exports.dataBekerja = async ( req, res) => {
    try {
        
        const kondisi = await Kondisi.findOne({ _id: "6721f27a98abfe25dbdd67d6" }); 
        if (!kondisi) return res.status(404).json({ message: "Kondisi not Found" });

       
        const mahasiswa = await Mahasiswa.find({ "kondisi._id": kondisi._id });
        if (!mahasiswa || mahasiswa.length === 0) {
            return res.status(404).json({ message: "Data bekerja Not Found" });
        }

        
        return res.status(200).json({
            message: `Kondisi ${kondisi.kondisi}`,
            data: {
                jumlah: mahasiswa.length,
                mahasiswa: mahasiswa
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Data",
            error: error.message
        });
    }
}

exports.dataWirausaha = async ( req, res) => {
    try {
       
        const kondisi = await Kondisi.findOne({ _id: "6721f29398abfe25dbdd67da" }); 
        if (!kondisi) return res.status(404).json({ message: "Kondisi not Found" });

   
        const mahasiswa = await Mahasiswa.find({ "kondisi._id": kondisi._id });
        if (!mahasiswa || mahasiswa.length === 0) {
            return res.status(404).json({ message: "Data Wirausaha Not Found" });
        }


        return res.status(200).json({
            message: `Kondisi ${kondisi.kondisi}`,
            data: {
                jumlah: mahasiswa.length,
                mahasiswa: mahasiswa
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Data",
            error: error.message
        });
    }
}

exports.dataBelumBekerja = async ( req, res) => {
    try {
       
        const kondisi = await Kondisi.findOne({ _id: "6721f28598abfe25dbdd67d8" }); 
        if (!kondisi) return res.status(404).json({ message: "Kondisi not Found" });

   
        const mahasiswa = await Mahasiswa.find({ "kondisi._id": kondisi._id });
        if (!mahasiswa || mahasiswa.length === 0) {
            return res.status(404).json({ message: "Data Wirausaha Not Found" });
        }


        return res.status(200).json({
            message: `Kondisi ${kondisi.kondisi}`,
            data: {
                jumlah: mahasiswa.length,
                mahasiswa: mahasiswa
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Data",
            error: error.message
        });
    }
}


exports.dataTidakBekerja = async ( req, res) => {
    try {
       
        const kondisi = await Kondisi.findOne({ _id: "6721f2a798abfe25dbdd67dc" }); 
        if (!kondisi) return res.status(404).json({ message: "Kondisi not Found" });

   
        const mahasiswa = await Mahasiswa.find({ "kondisi._id": kondisi._id });
        if (!mahasiswa || mahasiswa.length === 0) {
            return res.status(404).json({ message: "Data Wirausaha Not Found" });
        }


        return res.status(200).json({
            message: `Kondisi ${kondisi.kondisi}`,
            data: {
                jumlah: mahasiswa.length,
                mahasiswa: mahasiswa
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Data",
            error: error.message
        });
    }
}



exports.hasilKeselarasanHorizontal = async (req, res) => {
    try {
       
        const mahasiswa = await Mahasiswa.find({ "kampus.prodi": req.params.id })
            .populate('kampus.prodi')   
            .populate('kampus.kampus')  
            .populate('kondisi');       
        
        const mahasiswaIds = mahasiswa.map(mahasiswa => mahasiswa._id);
        const kondisiPekerjaan = await MahasiswaKondisi.find({ id_mahasiswa: { $in: mahasiswaIds }, pekerjaan: { $exists: true, $ne: null } })
            .populate('pekerjaan.bidang')
            .populate('pekerjaan.kategori')
            .populate('pekerjaan.jenis');

        const kondisiWirausaha = await MahasiswaKondisi.find({ id_mahasiswa: { $in: mahasiswaIds }, wirausaha: { $exists: true, $ne: null } })
            .populate('wirausaha.bidang')
            .populate('wirausaha.kategori')
            .populate('wirausaha.jenis');

        const hasil = {
                mahasiswa: mahasiswa,
                kondisi: {
                    pekerjaan: kondisiPekerjaan,
                    wirausaha: kondisiWirausaha
                }
        };

        
      
        if (hasil.kondisi.pekerjaan && hasil.kondisi.pekerjaan.length > 0) {
            console.log("Data pekerjaan tersedia:", hasil.kondisi.pekerjaan);
            // Ambil data prodi dari database
            const prodiData = await Prodi.find({}); // Mengambil semua data prodi
            console.log(prodiData)
            const prodiIds = prodiData.map(prodi => prodi.kondisi.bekerja.id_bidang); // Ambil id_bidang dari kondisi bekerja

            hasil.kondisi.pekerjaan.forEach(pekerjaan => {
                console.log("Pekerjaan:", pekerjaan);
                
                // Cek apakah id_bidang pekerjaan ada di prodiIds
                const isBidangMatched = prodiIds.includes(pekerjaan.idbidang);

                if (isBidangMatched) {
                    console.log(`Pekerjaan dengan id_bidang ${pekerjaan.idbidang} cocok dengan prodi.`);
                } else {
                    console.log(`Pekerjaan dengan id_bidang ${pekerjaan.idbidang} tidak cocok dengan prodi.`);
                }
            });
        } else {
            console.log("Tidak ada data pekerjaan.");
        }
       
        // return res.status(200).json({
        //     hasil: hasil,
           
        // });

        // return res.status(200).json({
        //     mahasiswa: mahasiswa,
        //     kondisi: [...kondisiPekerjaan, ...kondisiWirausaha]
        // });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to get data",
            error: error.message
        });
    }
};

 
