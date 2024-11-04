const Mahasiswa = require('../Models/MahasiswaModel');
const MahasiswaKondisi = require('../Models/BigData/MahasiswakondisiModel');
const Kondisi = require('../Models/BigData/KondisiModel');
const BidangWirausaha = require('../Models/BigData/Wirausaha/BidangUsahaModel');
const KategoriPekerjaan = require('../Models/BigData/Bekerja/KategoriPekerjaanmodel');
const JenisPekerjaan = require('../Models/BigData/Bekerja/JenisPekerjaanModel');
const Prodi = require('../Models/ProdiModel')
const HasilKeselarasanHorizontalModel = require('../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel');


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
        const hasil = await HasilKeselarasanHorizontalModel.find()
            .populate({
                path: 'id_mahasiswa',
                select: 'pribadi.nim pribadi.nama kampus.prodi kampus.kampus',
                populate: [
                    {
                        path: 'kampus.prodi',
                        select: '_id nama' 
                    },
                    {
                        path: 'kampus.kampus',
                        select: '_id psdku' 
                    },
                    {
                        path: 'kampus.tahun_lulusan',
                        select: '_id tahun_lulusan'
                    }
                ]
            });

            console.log(hasil)
        if (!hasil) return res.status(404).json({ message: "Data not found" });

        const summary = hasil.reduce((acc, item) => {
            const prodiId = item.id_mahasiswa.kampus.prodi._id
            const prodiNama = item.id_mahasiswa.kampus.prodi.nama
            const kampusId = item.id_mahasiswa.kampus.kampus._id
            const kampusNama = item.id_mahasiswa.kampus.kampus.psdku
            const lulusanId = item.id_mahasiswa.kampus.tahun_lulusan._id
            const lulusan = item.id_mahasiswa.kampus.tahun_lulusan.tahun_lulusan
            const tanggalDiperbarui = item.tanggal_diperbarui

            if (!acc[prodiId]) {
                acc[prodiId] = {
                    prodi_id: prodiId,
                    prodi_nama: prodiNama,
                    kampus_id : kampusId,
                    kampus_nama : kampusNama,
                    id_tahun_lulusan : lulusanId,
                    tahun_lulusan : lulusan,
                    tanggal_diperbarui : tanggalDiperbarui,
                    selaras: 0,
                    tidak_selaras: 0
                };
            }

            if (item.selaras) {
                acc[prodiId].selaras += 1;
            } else {
                acc[prodiId].tidak_selaras += 1;
            }

            return acc;
        }, {});

        
        const summaryArray = Object.values(summary);

        return res.status(200).json({
            message: "Successfully retrieved data",
            data: summaryArray
        });

    } catch (error) {
        console.error("Error retrieving data:", error);
        return res.status(500).json({
            message: "Failed to retrieve data",
            error: error.message
        });
    }
};





exports.detailHasilKeselarasanHorizontal = async (req, res) => {
    try {
        const hasil = await HasilKeselarasanHorizontalModel.find().populate({
            path : 'id_mahasiswa',
            populate : {
                path : 'kampus.prodi',
                select : '_id nama'
            }
        })
        if(!hasil) return res.status(404).json({ message : "Data not Found"})

        const jumlah = hasil.length;
        const jumlah_selaras = hasil.filter(item => item.selaras).length; 
        const jumlah_tidak_selaras = hasil.filter(item => !item.selaras).length;

        return res.status(200).json({
            message: "Successfully retrieved data",
            data: hasil,
            jumlah: jumlah,
            jumlah_selaras: jumlah_selaras,
            jumlah_tidak_selaras: jumlah_tidak_selaras
        });

    } catch (error) {
        console.error("Error retrieving data:", error);
        return res.status(500).json({
            message: "Failed to retrieve data",
            error: error.message
        });
    }
    
}









// exports.hasilKeselarasanHorizontal = async (req, res) => {
//     try {
//         const mahasiswaKondisi = await MahasiswaKondisi.find().populate('id_mahasiswa');
//         const prodiPekerjaan = await Prodi.find().populate('kondisi');

//         const dataMahasiswaSelaras = mahasiswaKondisi.map(mahasiswa => {
//             const { pekerjaan, wirausaha } = mahasiswa;
//             const kondisi = prodiPekerjaan.find(prodi => 
//                 prodi._id.equals(mahasiswa.id_mahasiswa.kampus.prodi)
//             )?.kondisi;

            
//             const pekerjaanSelaras = pekerjaan && kondisi?.bekerja &&
//                 pekerjaan.bidang && pekerjaan.bidang.equals(kondisi.bekerja.id_bidang) &&
//                 pekerjaan.kategori && pekerjaan.kategori.equals(kondisi.bekerja.id_kategori) &&
//                 pekerjaan.jenis && pekerjaan.jenis.equals(kondisi.bekerja.id_jenis);

//             const wirausahaSelaras = wirausaha && kondisi?.wiraswasta &&
//                 wirausaha.bidang && wirausaha.bidang.equals(kondisi.wiraswasta.id_bidang) &&
//                 wirausaha.kategori && wirausaha.kategori.equals(kondisi.wiraswasta.id_kategori) &&
//                 wirausaha.jenis && wirausaha.jenis.equals(kondisi.wiraswasta.id_jenis);

//             const selaras = pekerjaanSelaras || wirausahaSelaras;

//             return {
//                 ...mahasiswa.toObject(),
//                 selaras
//             };
//         });

//         return res.json({
//             data_mahasiswa: dataMahasiswaSelaras
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Unable to get data",
//             error: error.message
//         });
//     }
// };









// exports.hasilKeselarasanHorizontal = async (req, res) => {
//     try {
//         const mahasiswaKondisi = await MahasiswaKondisi.find().populate('id_mahasiswa');
//         const mahasiswa = await Mahasiswa.find()
//             .populate({
//                 path: 'kampus.prodi',
//                 populate: { path: 'kondisi' }
//             })
//             .populate({
//                 path: 'kampus.kampus',
//                 select: 'kode_pt tanggal_berdiri tanggal_sk alamat psdku'
//             })
//             .populate('kondisi');

       
//         const mahasiswaData = mahasiswa.map(item => ({
//             pribadi: item.pribadi,
//             kampus: item.kampus,
//             akun: item.akun,
//             kondisi: item.kondisi,
//             not_delete: item.not_delete,
//             createdAt: item.createdAt,
//             updatedAt: item.updatedAt
//         }));

//         return res.json({
//             dataUtama : mahasiswaData,
//             data: mahasiswaKondisi 
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Unable to get data",
//             error: error.message
//         });
//     }
// };


// exports.hasilKeselarasanHorizontal = async (req, res) => {
//     try {
       
//         const mahasiswa = await Mahasiswa.find({ "kampus.prodi": req.params.id })
//             .populate('kampus.prodi')   
//             .populate('kampus.kampus')  
//             .populate('kondisi');       
        
//         const mahasiswaIds = mahasiswa.map(mahasiswa => mahasiswa._id);
//         const kondisiPekerjaan = await MahasiswaKondisi.find({ id_mahasiswa: { $in: mahasiswaIds }, pekerjaan: { $exists: true, $ne: null } })
//             .populate('pekerjaan.bidang')
//             .populate('pekerjaan.kategori')
//             .populate('pekerjaan.jenis');

//         const kondisiWirausaha = await MahasiswaKondisi.find({ id_mahasiswa: { $in: mahasiswaIds }, wirausaha: { $exists: true, $ne: null } })
//             .populate('wirausaha.bidang')
//             .populate('wirausaha.kategori')
//             .populate('wirausaha.jenis');

//         const hasil = {
//                 mahasiswa: mahasiswa,
//                 kondisi: {
//                     pekerjaan: kondisiPekerjaan,
//                     wirausaha: kondisiWirausaha
//                 }
//         };

        
      
//         if (hasil.kondisi.pekerjaan && hasil.kondisi.pekerjaan.length > 0) {
//             console.log("Data pekerjaan tersedia:", hasil.kondisi.pekerjaan);
            
//             const prodiData = await Prodi.find({}); 
//             console.log(prodiData)
            

//             hasil.kondisi.pekerjaan.forEach(pekerjaan => {
//                 console.log("Pekerjaan:", pekerjaan);
//                 if (prodiData._id === pekerjaan.bidang){
                    
//                 }
                
//             });
//         } else {
//             console.log("Tidak ada data pekerjaan.");
//         }
       
//         // return res.status(200).json({
//         //     hasil: hasil,
           
//         // });

//         // return res.status(200).json({
//         //     mahasiswa: mahasiswa,
//         //     kondisi: [...kondisiPekerjaan, ...kondisiWirausaha]
//         // });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Unable to get data",
//             error: error.message
//         });
//     }
// };

 
