const Mahasiswa = require('../Models/MahasiswaModel');
const MahasiswaKondisi = require('../Models/BigData/MahasiswakondisiModel');
const Kondisi = require('../Models/BigData/KondisiModel');


// const BidangWirausaha = require('../Models/BigData/Wirausaha/BidangUsahaModel');
// const KategoriPekerjaan = require('../Models/BigData/Bekerja/KategoriPekerjaanmodel');
// const JenisPekerjaan = require('../Models/BigData/Bekerja/JenisPekerjaanModel');


const Prodi = require('../Models/ProdiModel')
const HasilKeselarasanHorizontalModel = require('../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel');
const HasilKeselararasanVertikal = require('../Models/DataProcessing/KeselarasanVertikal/HasilKeselararasanVertikal');
const OutputVertikal = require('../Models/Output/OutputVertikalModel');
const TracerStudyModel = require('../Models/TracerStudy/DataTracer/TracerStudyModel');









exports.totalResponden = async (req, res) => {
    try {
    
        const totalResponden = await TracerStudyModel.aggregate([
            { $unwind: "$id_responden" }, 
            { $group: { _id: null, total: { $sum: 1 } } } 
        ]);

        if (totalResponden.length === 0) {
            return res.status(404).json({ message: "Total Responden Not Found" });
        }

        return res.status(200).json({
            message: "Successfully retrieved total responden",
            data: totalResponden[0].total 
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Total Responden Data",
            error: error.message
        });
    }
};


exports.dataKondisi = async (req, res) => {
    try {
        
        const kondisiIds = [
            { _id: "6730dd268b77a9ff8577765a", message: "Data Bekerja" },   
            { _id: "6730dd2d8b77a9ff8577765c", message: "Data Wirausaha" },  
            { _id: "6730dd418b77a9ff8577765e", message: "Data Belum Bekerja" }, 
            { _id: "6730dd4d8b77a9ff85777660", message: "Data Tidak Bekerja" }  
        ];

        const results = [];
        for (let i = 0; i < kondisiIds.length; i++) {
            const kondisi = await Kondisi.findOne({ _id: kondisiIds[i]._id });
            if (!kondisi) {
                results.push({ message: `Kondisi ${kondisiIds[i].message} not found`, data: [] });
                continue;  
            }

            const mahasiswa = await Mahasiswa.find({ "kondisi._id": kondisi._id });
            if (mahasiswa && mahasiswa.length > 0) {
                results.push({
                    message: `Kondisi ${kondisi.kondisi}`,
                    data: {
                        jumlah: mahasiswa.length,
                        mahasiswa: mahasiswa
                    }
                });
            } else {
                results.push({ message: `Data ${kondisiIds[i].message} not found`, data: [] });
            }
        }

        return res.status(200).json({ results });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Data",
            error: error.message
        });
    }
};



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
            const prodiId = item.id_mahasiswa?.kampus?.prodi?._id || "N/A";
            const prodiNama = item.id_mahasiswa?.kampus?.prodi?.nama || "N/A";
            const kampusId = item.id_mahasiswa?.kampus?.kampus?._id || "N/A";
            const kampusNama = item.id_mahasiswa?.kampus?.kampus?.psdku || "N/A";
            const lulusanId = item.id_mahasiswa?.kampus?.tahun_lulusan?._id || "N/A";
            const lulusan = item.id_mahasiswa?.kampus?.tahun_lulusan?.tahun_lulusan || "N/A";
            const tanggalDiperbarui = item.tanggal_diperbarui;

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

        console.log("Data Summary", summaryArray);
        
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





// exports.detailHasilKeselarasanHorizontal = async (req, res) => {
//     try {
//         const hasil = await HasilKeselarasanHorizontalModel.find().populate({
//             path : 'id_mahasiswa',
//             populate : {
//                 path : 'kampus.prodi',
//                 select : '_id nama'
//             }
//         })
//         if(!hasil) return res.status(404).json({ message : "Data not Found"})

//         const jumlah = hasil.length;
//         const jumlah_selaras = hasil.filter(item => item.selaras).length; 
//         const jumlah_tidak_selaras = hasil.filter(item => !item.selaras).length;

//         return res.status(200).json({
//             message: "Successfully retrieved data",
//             data: hasil,
//             jumlah: jumlah,
//             jumlah_selaras: jumlah_selaras,
//             jumlah_tidak_selaras: jumlah_tidak_selaras
//         });

//     } catch (error) {
//         console.error("Error retrieving data:", error);
//         return res.status(500).json({
//             message: "Failed to retrieve data",
//             error: error.message
//         });
//     }
    
// }

// exports.getTracerProdiGrouping = async (req, res) => {
//     try {
        
//         const hasilKeselarasan = await HasilKeselararasanVertikal.find()
//             .populate({
//                 path: 'id_mahasiswa',
//                 populate: {
//                     path: 'kampus.prodi', 
//                     select: 'nama' 
//                 }
//             });

//         if (!hasilKeselarasan || hasilKeselarasan.length === 0) {
//             return res.status(404).json({ message: 'Data keselarasan vertikal Not Found' });
//         }

//         const prodiCount = hasilKeselarasan.reduce((result, item) => {
//             const prodiName = item.id_mahasiswa?.kampus?.prodi?.nama || 'Prodi not Found';
//             result[prodiName] = (result[prodiName] || 0) + 1;
//             return result;
//         }, {});

//         const groupedData = Object.keys(prodiCount).map((prodi) => ({
//             prodi,
//             jumlah: prodiCount[prodi]
//         }));

//         return res.status(200).json({
//             message: 'Succesfully get',
//             data: groupedData
//         });
//     } catch (error) {
//         console.error('Unable and Error retrieving prodi grouping:', error);
//         return res.status(500).json({ message: 'Unable and Error retrieving prodi grouping:', error: error.message });
//     }
// };


// exports.processingForVertikal = async (req, res) => {
//     try {
//         const hasilKeselarasan = await HasilKeselararasanVertikal.find()
//         .populate({
//             path: 'id_mahasiswa',
//             populate: {
//                 path: 'kampus.prodi', 
//                 select: 'nama jenjang' 
//             },
            
//         }).populate({
//             path : 'id_mahasiswa',
//             populate : {
//                 path : 'kampus.tahun_lulusan',
//                 select : 'tahun_lulusan'
//             }
//         })

//         if (!hasilKeselarasan || hasilKeselarasan.length === 0) {
//             return res.status(404).json({ message: 'Data keselarasan vertikal Not Found' });
//         }

//         const groupedData = {};
//         hasilKeselarasan.forEach(item => {
//             const mahasiswa = item.id_mahasiswa;
//             const tahunLulusan = mahasiswa?.kampus?.tahun_lulusan?.tahun_lulusan || null;
//             const jenjang = mahasiswa?.kampus?.prodi?.jenjang || null;
//             const prodi = mahasiswa?.kampus?.prodi?.nama || null;

//             if (tahunLulusan && jenjang && prodi) {
//                 const key = `${tahunLulusan}-${jenjang}-${prodi}`;

//                 if (!groupedData[key]) {
//                     groupedData[key] = {
//                         tahun_lulusan: tahunLulusan,
//                         jenjang: jenjang,
//                         prodi: prodi,
//                         tinggi: 0,
//                         sama: 0,
//                         rendah: 0,
//                     };
//                 }

//                 groupedData[key].tinggi += item.tinggi;
//                 groupedData[key].sama += item.sama;
//                 groupedData[key].rendah += item.rendah;
//             }
//         });

//         if (!groupedData) {
//             console.log("Failed Grouping Data");
//             return res.status(400).json({ message : "Failed Grouping Data" })
//         }

//         console.log("Succesfully grup data", groupedData );
        
        
//         const outputData = Object.values(groupedData).map(group => {
//             const total = group.tinggi + group.sama + group.rendah;
//             return {
//                 tahun_lulusan: group.tahun_lulusan,
//                 jenjang: group.jenjang,
//                 prodi: group.prodi,
//                 keselarasan: {
//                     tinggi: {
//                         jumlah: group.tinggi,
//                         persentase: total > 0 ? `${((group.tinggi / total) * 100).toFixed(2)}%` : '0%',
//                     },
//                     sama: {
//                         jumlah: group.sama,
//                         persentase: total > 0 ? `${((group.sama / total) * 100).toFixed(2)}%` : '0%',
//                     },
//                     rendah: {
//                         jumlah: group.rendah,
//                         persentase: total > 0 ? `${((group.rendah / total) * 100).toFixed(2)}%` : '0%',
//                     },
//                 },
//             };
//         });

      

//         const savedOutputs = await OutputVertikal.insertMany(outputData);

//         if(!savedOutputs) {
//             console.log("Failed to Saved Output Horizontal");
//             return res.status(400).json({
//                 message : "Failed to Saved Output Horizontal"
//             })
            
//         }

//         console.log("Succesfully saved data \n", savedOutputs);
//         return res.status(200).json({
//             message : "Succesfully saved data",
//             data : savedOutputs
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             message : "Unable to processing",
//             error : error.message
//         })
//     }
// }









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

 
