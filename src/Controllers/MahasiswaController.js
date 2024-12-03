const Kondisi = require('../Models/BigData/KondisiModel')
const Mahasiswa = require('../Models/MahasiswaModel')
const MahasiswaKondisi = require('../Models/BigData/MahasiswakondisiModel')
const TracerStudy = require('../Models/TracerStudy/DataTracer/TracerStudyModel')


const hasilKeselarasanHorizontal = require('../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel');
const MasterDataPekerjaanModel = require('../Models/BigData/MasterDataPekerjaanModel');
const MasterDataWirausaha = require('../Models/BigData/MasterDataWirausaha')
const MasterDataBelumBekerja = require('../Models/BigData/MasterDataBelumBekerja')
const RespondenModel = require('../Models/TracerStudy/DataTracer/RespondenModel');
const HasilKeselarasanVertikal = require('../Models/DataProcessing/KeselarasanVertikal/HasilKeselararasanVertikal')


const multer = require("multer");
const xlsx = require("node-xlsx");


const { JWT_SECRET, JWT_ACCESS_EXPIRATION } = process.env;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateTokensMahasiswa } = require('../Middleware/AuthenticateMiddleware');
const OutputHorizontalModel = require('../Models/Output/OutputHorizontalModel');
const { default: mongoose } = require('mongoose');



exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalMahasiswa = await Mahasiswa.countDocuments({ not_delete: true });
        const mahasiswaList = await Mahasiswa.find({ not_delete: true })
            .skip(skip)
            .limit(limit)
            .populate("kampus.prodi", "nama")
            .populate("kampus.tahun_lulusan", "tahun_lulusan")
            .populate("kampus.kampus", "kampus")
            .populate("kondisi");

            // const dataWithHash = mahasiswaList.map(mahasiswa => {
            //     return {
            //         ...mahasiswa.toObject(),
            //         hashedPassword: mahasiswa.akun.password 
            //     };
            // });

        const totalPages = Math.ceil(totalMahasiswa / limit);

        return res.status(200).json({
            message: "Get all Mahasiswa successfully",
            data: mahasiswaList,
            meta: {
                currentPage: page,
                totalPages: totalPages,
                totalMahasiswa: totalMahasiswa,
                pageSize: limit
            }
        });
    } catch (error) {
        console.error("Failed to get Mahasiswa:", error);
        return res.status(500).json({
            message: "Failed to get data",
            error: error.message || error
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const mahasiswaId = req.params.id;
        const mahasiswa = await Mahasiswa.findOne({ _id: mahasiswaId, not_delete: true })
            .populate("kampus.prodi", "prodi")
            .populate("kampus.kampus", "psdku")
            .populate("kondisi");

        if (!mahasiswa) {
            return res.status(404).json({
                message: "Mahasiswa not found"
            });
        }

        return res.status(200).json({
            message: "Get Mahasiswa by ID successfully",
            data: mahasiswa
        });
    } catch (error) {
        console.error("Failed to get Mahasiswa by ID:", error);
        return res.status(500).json({
            message: "Failed to get data",
            error: error.message || error
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const mahasiswaId = req.user.id; 
        const mahasiswa = await Mahasiswa.findById(mahasiswaId);

        if (!mahasiswa) {
            return res.status(404).json({ message: "Mahasiswa not found" });
        }

        return res.status(200).json({
            message: "Mahasiswa profile retrieved successfully",
            data: mahasiswa,
        });
    } catch (error) {
        console.error("Error retrieving mahasiswa profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.search = async (req, res) => {
    try {
        const { nama, nim, email } = req.query;

        const searchCriteria = {
            not_delete: true,
            ...(nama && { "pribadi.nama": new RegExp(nama, 'i') }),
            ...(nim && { "pribadi.nim": nim }),
            ...(email && { "akun.email": email })
        };

        const mahasiswaList = await Mahasiswa.find(searchCriteria)
            .populate("kampus.prodi", "prodi")
            .populate("kampus.kampus", "psdku")
            .populate("kondisi");

        if (!mahasiswaList.length) {
            return res.status(404).json({
                message: "No Mahasiswa found with provided criteria"
            });
        }

        return res.status(200).json({
            message: "Search Mahasiswa successfully",
            data: mahasiswaList
        });
    } catch (error) {
        console.error("Failed to search Mahasiswa:", error);
        return res.status(500).json({
            message: "Failed to search data",
            error: error.message || error
        });
    }
};


exports.addMahasiswa = async (req, res) => {
    try {
        const { pribadi, akun, kampus, status } = req.body;

        if (!pribadi || !akun || !kampus || !akun.password) {
            return res.status(400).json({ message: "Required fields are missing (pribadi, akun, kampus, password)" });
        }

        const hashedPassword = await bcrypt.hash(akun.password, 10);

        const mahasiswa = new Mahasiswa({
            pribadi,
            akun: { ...akun, password: hashedPassword },
            kampus,
            status: status || "Aktif",
        });

        // const mahasiswa = new Mahasiswa({
        //     pribadi,
        //     akun,
        //     kampus,
        //     status
        // })

        await mahasiswa.save();

        return res.status(201).json({
            message: "Mahasiswa successfully added",
            data: mahasiswa
        });
    } catch (error) {
        console.error("Failed to add Mahasiswa:", error);
        return res.status(500).json({ message: "Failed to add data", error: error.message });
    }
};





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype === "application/vnd.ms-excel"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type, only Excel or CSV allowed!"));
        }
    },
}).single("file");


exports.importMahasiswa = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {

            const filePath = req.file.path;
            const workSheets = xlsx.parse(filePath);
            const sheetData = workSheets[0].data; 

            const jsonData = sheetData.slice(1).map((row) => ({
                nim: row[0],
                nama: row[1],
                jk: row[2],
                ttl: row[3],
                email: row[4],
                password: row[5],
                prodi: row[6],
                kampus: row[7],
                tahun_lulusan: row[8],
                status: row[9],
            }));

            const importedData = [];
            for (const row of jsonData) {
                const { nim, nama, jk, ttl, email, password, prodi, kampus, tahun_lulusan, status } = row;

                if (!nim || !nama || !email || !password) {
                    continue;
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const mahasiswa = new Mahasiswa({
                    pribadi: { nim, nama, jk, ttl },
                    akun: { email, password: hashedPassword },
                    kampus: { prodi, kampus, tahun_lulusan },
                    status: status || "Aktif",
                });

                importedData.push(mahasiswa);
            }

            await Mahasiswa.insertMany(importedData);

            return res.status(200).json({
                message: "Data Mahasiswa successfully imported",
                importedCount: importedData.length,
            });
        } catch (error) {
            console.error("Error importing data:", error);
            return res.status(500).json({ message: "Failed to import data", error: error.message });
        }
    });
};


exports.edit = async (req, res) => {
    try {
        const mahasiswaId = req.params.id;
        const updatedData = req.body;

        const updatedMahasiswa = await Mahasiswa.findByIdAndUpdate(
            mahasiswaId,
            updatedData,
            { new: true, runValidators: true }
        )
            .populate("kampus.prodi", "name")
            .populate("kampus.kampus", "name")
            .populate("kondisi");

        if (!updatedMahasiswa) {
            return res.status(404).json({
                message: "Mahasiswa not found"
            });
        }

        return res.status(200).json({
            message: "Mahasiswa successfully updated",
            data: updatedMahasiswa
        });
    } catch (error) {
        console.error("Failed to update Mahasiswa:", error);
        return res.status(500).json({
            message: "Failed to update data",
            error: error.message || error
        });
    }
};


exports.deleteMahasiswa = async (req, res) => {
    try {
        const mahasiswaId = req.params.id;

        const mahasiswa = await Mahasiswa.findById(mahasiswaId);
        if (!mahasiswa || !mahasiswa.not_delete) {
            return res.status(404).json({
                message: "Mahasiswa not found or already deleted"
            });
        }

        mahasiswa.not_delete = false;
        await mahasiswa.save();

        return res.status(200).json({
            message: "Mahasiswa successfully deleted",
            data: mahasiswa
        });
    } catch (error) {
        console.error("Failed to delete Mahasiswa:", error);
        return res.status(500).json({
            message: "Failed to delete data",
            error: error.message || error
        });
    }
};

//================ Auth Mahasiswa ======================

exports.login = async (req, res) => {
    try {
        const { nim, password } = req.body;

        if (!nim || !password) {
            return res.status(400).json({ message: "NIM dan password Required" });
        }

        const user = await Mahasiswa.findOne({ "pribadi.nim": nim }).populate('akun.role_id');
        console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: "Mahasiswa Not Found" });
        }
        if (user.not_delete = false) {
            console.log("Mahasiswa inactive");
            return res.status(400).json({
                message : "Mahasiswa inactive"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.akun.password);

      
        console.log("Password Input:", password); 
        console.log("Password Hash di Database:", user.akun.password); 

        if (!isPasswordValid) {
            console.log(!isPasswordValid);
            
            return res.status(401).json({ message: "Wrong Password" });
        }
        const { accessToken, refreshToken } = generateTokensMahasiswa(user);

        return res.status(200).json({
            message: "Login berhasil",
            token: {
                accessToken,
                refreshToken,
            },
            user: {
                id: user._id,
                nim: user.pribadi.nim,
                nama: user.pribadi.nama,
                email: user.akun.email,
                role: user.akun.role_id.role,
            },
        });
    } catch (error) {
        console.error("Unable Login:", error);
        return res.status(500).json({ message: "Unable to Login", error: error.message });
    }
};



exports.add = async (req, res) => {
    try {
        const { kondisi } = req.body
        if(!kondisi) return res.status(404).json({
            message: "Data Required"
        })

        const data = new Kondisi(req.body)
        await data.save()

        return res.status(200).json({
            data : data
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message : "Unable to add Kondisi",
            error
        })
    }
}

//=========================== Mahasiswa Kondisi====================

// exports.addMahasiswaKondisi = async (req, res) => {
//     try {
//         const data = req.body;
//         if (!data) {
//             return res.status(400).json({ message: "Data required" });
//         }

//         const kondisiMahasiswa = new MahasiswaKondisi(data);
//         await kondisiMahasiswa.save();

//         if (!kondisiMahasiswa) {
//             console.error("Data not Found");
//             return res.status(400).json({ message: "Failed to add Kondisi Mahasiswa" });
//         } else {// SEARCH Mahasiswa with not_delete = true
//             const dataKondisi = await MahasiswaKondisi.findById(kondisiMahasiswa._id).populate('id_mahasiswa');
//             const masterDataPekerjaan = await MasterDataPekerjaanModel.find();
//             const masterDataWirausaha = await MasterDataWirausaha.find()
//             const masterDataBelumBekerja = await MasterDataBelumBekerja.find()

//             const idProdiMahasiswa = dataKondisi.id_mahasiswa.kampus.prodi;
            
//             let selaras = false;

//             const pekerjaanSelaras = masterDataPekerjaan.some((masterData) => {
//                 if (masterData.id_prodi.equals(idProdiMahasiswa)) {
//                     console.log("Prodi mahasiswa sesuai dengan master data pekerjaan");
                    
//                     const { pekerjaan } = kondisiMahasiswa;
//                     return pekerjaan?.some((pekerjaanData) => {
//                         return masterData.pekerjaan.some((masterPekerjaan) => {
//                             return masterPekerjaan.namaBidang === pekerjaanData.bidang &&
//                                 masterPekerjaan.jenisPekerjaan.some((jenisPekerjaan) => {
//                                     return pekerjaanData.jenis_pekerjaan.some((jenis) => 
//                                         jenis.jenis === jenisPekerjaan.jenis &&
//                                         jenisPekerjaan.posisi.includes(jenis.posisi)
//                                     );
//                                 });
//                         });
//                     });
//                 }
//                 return false;
//             });

//             const wirausahaSelaras = masterDataWirausaha.some((masterData) => {
//                 if (masterData.id_prodi.equals(idProdiMahasiswa)) {
//                     console.log("Prodi mahasiswa sesuai dengan master data wirausaha");

//                     const { wirausaha } = kondisiMahasiswa;
//                     if (wirausaha && wirausaha.namaUsaha && masterData.wirausaha) {
//                         return masterData.wirausaha.some((masterWirausaha) => {
//                             return masterWirausaha.jenisUsaha.includes(wirausaha.jenisUsaha);
//                         });
//                     }
//                 }
//                 return false;
//             });

//             const belumBekerjaSelaras = masterDataBelumBekerja.some((masterData) => {
//                 if (masterData.id_prodi.equals(idProdiMahasiswa)) {
//                     console.log("Prodi mahasiswa sesuai dengan master data belum bekerja");

//                     const { belum_bekerja } = kondisiMahasiswa;
//                     return belum_bekerja?.some((belumData) => {
//                         return masterData.pekerjaan.some((masterBelum) => {
//                             return masterBelum.namaBidang === belumData.bidang &&
//                                 masterBelum.kategoriPekerjaan.some((kategori) => {
//                                     return kategori.jenis.some((jenis) =>
//                                         jenis === belumData.kategori_pekerjaan?.jenis
//                                     );
//                                 });
//                         });
//                     });
//                 }
//                 return false;
//             });

//             // const belumBekerjaSelaras = masterDataBelumBekerja.some((masterData) => {
//             //     if (masterData.id_prodi.equals(idProdiMahasiswa)){
//             //         console.log("Prodi mahasiswa sesuai dengan data wirausaha")
//             //         const { belum_bekerja } = kondisiMahasiswa;
//             //         if ( belum_bekerja && belum_bekerja.namaBidang && masterData.belum_bekerja){
//             //             return masterData.belum_bekerja.some((masterBelumBekerja) => {
//             //                 return masterBelumBekerja.kategoriPekerjaan.includes(belum_bekerja.jenis)
//             //             })
//             //         }
//             //     }
//             // })
    

//             selaras = pekerjaanSelaras || wirausahaSelaras || belumBekerjaSelaras;

//             if (!pekerjaanSelaras && !wirausahaSelaras) {
//                 console.log("Prodi mahasiswa tidak sesuai dengan master data pekerjaan atau wirausaha");
//             }// SEARCH Mahasiswa with not_delete = true

//             let keselarasan = await hasilKeselarasanHorizontal.findOne({ id_mahasiswa: dataKondisi.id_mahasiswa._id });
//             if (keselarasan) {
//                 keselarasan.selaras = selaras;
//                 keselarasan.tanggal_diperbarui = new Date();
//                 await keselarasan.save();
//             } else {
//                 keselarasan = new hasilKeselarasanHorizontal({
//                     id_mahasiswa: dataKondisi.id_mahasiswa._id,
//                     selaras,
//                     tanggal_diperbarui: new Date()
//                 });
//                 await keselarasan.save();
//             }

//             return res.status(200).json({
//                 message: "Successfully added",
//                 data: kondisiMahasiswa,
//                 get_dataKondisi: dataKondisi,
//                 hasil: selaras ? "Selaras" : "Tidak Selaras"
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Unable to add data",
//             error: error.message
//         });
//     }
// };


exports.addMahasiswaKondisi = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ message: "Data required" });
        }

        const kondisiMahasiswa = new MahasiswaKondisi(data);
        await kondisiMahasiswa.save();

        if (!kondisiMahasiswa) {
            console.error("Data not Found");
            return res.status(400).json({ message: "Failed to add Kondisi Mahasiswa" });
        } else {
            // SEARCH Mahasiswa with not_delete = true
            const dataKondisi = await MahasiswaKondisi.findById(kondisiMahasiswa._id).populate('id_mahasiswa');
            const masterDataPekerjaan = await MasterDataPekerjaanModel.find();
            const masterDataWirausaha = await MasterDataWirausaha.find();
            const masterDataBelumBekerja = await MasterDataBelumBekerja.find();

            const idProdiMahasiswa = dataKondisi.id_mahasiswa.kampus.prodi;

            let selaras = false;

            const pekerjaanSelaras = masterDataPekerjaan.some((masterData) => {
                if (masterData.id_prodi.equals(idProdiMahasiswa)) {
                    console.log("Prodi mahasiswa sesuai dengan master data pekerjaan");

                    const { pekerjaan } = kondisiMahasiswa;
                    return pekerjaan?.some((pekerjaanData) => {
                        return masterData.pekerjaan.some((masterPekerjaan) => {
                            return masterPekerjaan.namaBidang === pekerjaanData.bidang &&
                                masterPekerjaan.jenisPekerjaan.some((jenisPekerjaan) => {
                                    return pekerjaanData.jenis_pekerjaan.some((jenis) =>
                                        jenis.jenis === jenisPekerjaan.jenis &&
                                        jenisPekerjaan.posisi.includes(jenis.posisi)
                                    );
                                });
                        });
                    });
                }
                return false;
            });

            const wirausahaSelaras = masterDataWirausaha.some((masterData) => {
                if (masterData.id_prodi.equals(idProdiMahasiswa)) {
                    console.log("Prodi mahasiswa sesuai dengan master data wirausaha");

                    const { wirausaha } = kondisiMahasiswa;
                    if (wirausaha && wirausaha.namaUsaha && masterData.wirausaha) {
                        return masterData.wirausaha.some((masterWirausaha) => {
                            return masterWirausaha.jenisUsaha.includes(wirausaha.jenisUsaha);
                        });
                    }
                }
                return false;
            });

            const belumBekerjaSelaras = masterDataBelumBekerja.some((masterData) => {
                if (masterData.id_prodi.equals(idProdiMahasiswa)) {
                    console.log("Prodi mahasiswa sesuai dengan master data belum bekerja");

                    const { belum_bekerja } = kondisiMahasiswa;
                    return belum_bekerja?.some((belumData) => {
                        return masterData.pekerjaan.some((masterBelum) => {
                            return masterBelum.namaBidang === belumData.bidang &&
                                masterBelum.kategoriPekerjaan.some((kategori) => {
                                    return kategori.jenis.some((jenis) =>
                                        jenis === belumData.kategori_pekerjaan?.jenis
                                    );
                                });
                        });
                    });
                }
                return false;
            });

            selaras = pekerjaanSelaras || wirausahaSelaras || belumBekerjaSelaras;

            if (!selaras) {
                console.log("Prodi mahasiswa tidak sesuai dengan master data pekerjaan, wirausaha, atau belum bekerja");
            }

            let keselarasan = await hasilKeselarasanHorizontal.findOne({ id_mahasiswa: dataKondisi.id_mahasiswa._id });
            if (keselarasan) {
                keselarasan.selaras = selaras;
                keselarasan.tanggal_diperbarui = new Date();
                await keselarasan.save();
            } else {
                keselarasan = new hasilKeselarasanHorizontal({
                    id_mahasiswa: dataKondisi.id_mahasiswa._id,
                    selaras,
                    tanggal_diperbarui: new Date()
                });
                await keselarasan.save();
            }

            return res.status(200).json({
                message: "Successfully added",
                data: kondisiMahasiswa,
                get_dataKondisi: dataKondisi,
                hasil: selaras ? "Selaras" : "Tidak Selaras"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to add data",
            error: error.message
        });
    }
};








// exports.addmahasiswaKondisi = async (req, res) => {
//     try {
//         const data = req.body;
//         if (!data) {
//             return res.status(400).json({
//                 message: "Data required"
//             });
//         }

//         const kondisiMahasiswa = new MahasiswaKondisi(data);
//         awaiTracer Study t kondisiMahasiswa.save();

//         if(!kondisiMahasiswa){
//             return res.status(400).json({ message : "Failed to add Kondisi Mahasiswa" })
//         } else {
//             const mahasiswaKondisi = await MahasiswaKondisi.findById(kondisiMahasiswa._id).populate('id_mahasiswa');
//             const prodiPekerjaan = await Prodi.find().populate('kondisi');

//             const { pekerjaan, wirausaha } = mahasiswaKondisi;
//             const kondisi = prodiPekerjaan.find(prodi =>
//                 prodi._id.equals(mahasiswaKondisi.id_mahasiswa.kampus.prodi)
//             )?.kondisi;

//             const pekerjaanSelaras = pekerjaan && kondisi?.bekerja &&
//                 pekerjaan.bidang && pekerjaan.bidang.equals(kondisi.bekerja.id_bidang) &&
//                 pekerjaan.kategori && pekerjaan.kategori.equals(kondisi.bekerja.id_kategori) &&
//                 pekerjaan.jenis && pekerjaan.jenis.equals(kondisi.bekerja.id_jenis);

//             const wirausahaSelaras = wirausaha && kondisi?.wiraswasta &&
//                 wirausaha.bidang && wirausaha.bidang.equals(kondisi.wiraswasta.id_bidang) &&
//                 wirausaha.kategori && wirausaha.kategori.equals(kondisi.wiraswasta.id_kategori) &&
//                 wirausaha.jenis && wirausaha.jenis.equals(kondisi.wiraswasta.id_jenis);

//                 const selaras = Boolean(pekerjaanSelaras || wirausahaSelaras);

//             let keselarasan = await hasilKeselarasanHorizontal.findOne({ id_mahasiswa: mahasiswaKondisi.id_mahasiswa._id });

//             if (keselarasan) {
//                 keselarasan.selaras = selaras;
//                 keselarasan.tanggal_diperbarui = new Date();
//                 await keselarasan.save();
//             } else {
//                 keselarasan = new hasilKeselarasanHorizontal({
//                     id_mahasiswa: mahasiswaKondisi.id_mahasiswa._id,
//                     // prodi: mahasiswa.kampus.prodi.name,
//                     selaras,
//                     tanggal_diperbarui: new Date()
//                 });
//                 await keselarasan.save();
//                 console.log(keselarasan)
//             }
//         }
//         return res.status(200).json({
//             message: "Successfully added",
//             data: kondisiMahasiswa
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Unable to add data",
//             error: error.message
//         });
//     }
// };


//==================== TRACER STUDI ================================

exports.getTracerMahasiswa = async (req, res) => {
    try {
        
        const dataTracer = await TracerStudy.find({ not_delete : true, status : 'Berlangsung'})
            .populate('id_soal')
            .populate('skala_kegiatan.prodi')
            .populate('skala_kegiatan.tahun_lulusan')
            .populate('id_detail')

       
        const mahasiswaTracer = await Mahasiswa.find()
            .populate('kampus')

        // return res.json({
        //     data1 : dataTracer,
        //     data2 : mahasiswaTracer
        // })
        
        const hasil = dataTracer.filter((tracer) => {
            
            const tracerTahunLulusan =  tracer.skala_kegiatan.tahun_lulusan._id.toString()

            return mahasiswaTracer.some((mhs) => {
                const mahasiswaTahunLulusan = mhs.kampus.tahun_lulusan.toString();
                return tracerTahunLulusan === mahasiswaTahunLulusan;
            });
        });

        console.log("Succesfully get Data Tracer to Mahasiswa \n data :", hasil);
        
        return res.status(200).json({
            message: "Succesfully get Data Tracer to Mahasiswa",
            data: hasil
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error: err.message
        });
    }
};

exports.getSoalByTahunLulusan = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 1; 

        const mahasiswaTracer = await Mahasiswa.findById(req.params.id).populate('kampus.tahun_lulusan');
        
        if (!mahasiswaTracer) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa Not Found'
            });
        }

        const tahunLulusanMahasiswa = mahasiswaTracer.kampus.tahun_lulusan._id;

        const dataTracer = await TracerStudy.findOne({
            'skala_kegiatan.tahun_lulusan': tahunLulusanMahasiswa
        });

        if (!dataTracer) {
            return res.status(404).json({
                success: false,
                message: 'Data tracer study Not Found for this tahun lulusan'
            });
        }

        const soalData = await Soal.find()
            .skip((page - 1) * limit)
            .limit(limit);

        if (soalData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data soal Not Found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Succesfully Get Soal',
            currentPage: page,
            totalPages: Math.ceil(await Soal.countDocuments({ id_mahasiswa: mahasiswaTracer._id }) / limit),
            data: soalData.map((item) => ({
                _id: item._id,
                soal: item.soal,
                jawaban: item.jawaban.map((jawabanItem) => ({
                    jawaban: jawabanItem.jawaban,
                    bobot_jawaban: jawabanItem.bobot_jawaban
                })),
            }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Unable to get Soal',
            error: err.message
        });
    }
};


exports.getSoalToMahasiswa = async (req, res) => {
    try {

        console.log(req.user.id);
        
        const mahasiswaTracer = await Mahasiswa.findById(req.user.id).populate('kampus.tahun_lulusan');
        if (!mahasiswaTracer) {
            return res.status(404).json({
                success: false,
                message: 'Data mahasiswa Not Found'
            });
        }

        const tahunLulusanMahasiswa = mahasiswaTracer.kampus.tahun_lulusan._id;

        const dataTracer = await TracerStudy.findOne({
            'skala_kegiatan.tahun_lulusan': tahunLulusanMahasiswa
        });
        if (!dataTracer) {
            return res.status(404).json({
                success: false,
                message: 'Data tracer study Not Found for this tahun lulusan'
            });
        }

        const tracerDetail = await TracerStudy.findById(dataTracer._id).populate('id_soal');
        if (!tracerDetail || !tracerDetail.id_soal.length) {
            return res.status(404).json({
                success: false,
                message: 'Soal Not Found'
            });
        }

        const soalProcessed = tracerDetail.id_soal.map(soal => ({
            _id: soal._id,
            soal: soal.soal,
            jawaban: soal.jawaban.map(jawaban => ({
                jawaban: jawaban.jawaban,
                bobot_jawaban: jawaban.bobot_jawaban
            }))
        }));

        return res.status(200).json({
            success: true,
            data: soalProcessed
        });

    } catch (error) {
        console.error("Unable to get Soal:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to get Soal',
            error: error.message
        });
    }
};


exports.postJawabanMahasiswa = async (req, res) => {
    try {
        const id_mahasiswa = req.user.id; 
        const jawabanArray = req.body.jawaban; 

        if(!jawabanArray) {
            console.log("Data Required");
            return res.status(400).json({ message : "Data Required"})
        }

        if(!id_mahasiswa) {
            return res.status(400).json({
                message : 'id_mahasiswa not found'
            })
        }

        if (!Array.isArray(jawabanArray)) {
            return res.status(400).json({
                message: 'Invalid data format, jawaban must be an array'
            });
        }
        

        const mahasiswaExists = await Mahasiswa.findById(id_mahasiswa);
        if (!mahasiswaExists) {
            return res.status(404).json({ message: 'Mahasiswa Not Found' });
        }

        let responden = await RespondenModel.findOne({ id_mahasiswa });

        if (responden) {
            
            jawabanArray.forEach(({ id_soal, jawaban, bobot_jawaban }) => {
                const indexSoal = responden.jawaban.findIndex(item => item.id_soal.toString() === id_soal);

                if (indexSoal !== -1) {
                    
                    responden.jawaban[indexSoal].jawaban = jawaban;
                    responden.jawaban[indexSoal].bobot_jawaban = bobot_jawaban;
                } else {
                  
                    responden.jawaban.push({ id_soal, jawaban, bobot_jawaban });
                }
            });

            await responden.save();
        } else {
            
            const newJawaban = jawabanArray.map(({ id_soal, jawaban, bobot_jawaban }) => ({
                id_soal,
                jawaban,
                bobot_jawaban
            }));

            responden = new RespondenModel({
                id_mahasiswa,
                jawaban: newJawaban
            });

            await responden.save();
        }

        let tracer = await TracerStudy.findOne({ id_responden: id_mahasiswa });

        if (!tracer) {
            tracer = new TracerStudy({ id_responden: [id_mahasiswa] });
            await tracer.save();
        }

        return res.status(200).json({
            message: 'Jawaban Saved Successfully',
            data: responden
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Unable to save Jawaban',
            error: error.message
        });
    }
};


exports.handleJawabanAndCalculateScores = async (req, res) => {
    try {
        const id_mahasiswa = req.user.id; 
        const jawabanArray = req.body.jawaban;

        if (!jawabanArray || !Array.isArray(jawabanArray)) {
            return res.status(400).json({ message: 'Invalid data format, jawaban must be an array' });
        }

        console.error(`Its ${id_mahasiswa}`);


        if(!id_mahasiswa) {
            console.error(`Not Found`);
            
            return res.status(400).json({
                message : 'id_mahasiswa not found'
            })
        }

        const mahasiswaExists = await Mahasiswa.findById(id_mahasiswa);
        if (!mahasiswaExists) {
            return res.status(404).json({ message: 'Mahasiswa Not Found' });
        }

        let responden = await RespondenModel.findOne({ id_mahasiswa });

        if (responden) {
            jawabanArray.forEach(({ id_soal, jawaban, bobot_jawaban }) => {
                const indexSoal = responden.jawaban.findIndex(item => item.id_soal.toString() === id_soal);
                if (indexSoal !== -1) {
                    responden.jawaban[indexSoal].jawaban = jawaban;
                    responden.jawaban[indexSoal].bobot_jawaban = bobot_jawaban;
                } else {
                    responden.jawaban.push({ id_soal, jawaban, bobot_jawaban });
                }
            });

            await responden.save();
        } else {
            const newJawaban = jawabanArray.map(({ id_soal, jawaban, bobot_jawaban }) => ({
                id_soal,
                jawaban,
                bobot_jawaban
            }));

            responden = new RespondenModel({
                id_mahasiswa,
                jawaban: newJawaban
            });

            await responden.save();
        }

        let tracer = await TracerStudy.findOne({ id_responden: id_mahasiswa });
        if (!tracer) {
            tracer = new TracerStudy({ id_responden: [id_mahasiswa] });
            await tracer.save();
            if (!tracer){
                console.log("Failed to saved id_mahasiswa");
                return res.json({
                    message : "Failed to Saved"
                })
            }
        }


        const idTracer = tracer._id;

        const latestRespondenData = await RespondenModel.findOne({ id_mahasiswa })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'jawaban.id_soal',
                select: 'soal jawaban'
            });

        if (latestRespondenData) {
            let tinggi = 0, sama = 0, rendah = 0, totalSkor = 0;

            for (const jawabanResponden of latestRespondenData.jawaban) {
                const soal = jawabanResponden.id_soal;
                const jawabanPilih = jawabanResponden.jawaban;
                const jawab = soal?.jawaban.find(jawaban => jawaban.jawaban === jawabanPilih);

                if (jawab) {
                    const bobot = jawab.bobot_jawaban;
                    if (bobot >= 4) tinggi += bobot;
                    else if (bobot === 3) sama += bobot;
                    else if (bobot <= 2) rendah += bobot;
                    totalSkor += bobot;
                }
            }

            const existingRecord = await HasilKeselarasanVertikal.findOne({ id_mahasiswa, idTracer });
            if (existingRecord) {
                existingRecord.tanggal_diperbarui = new Date();
                existingRecord.tinggi = tinggi;
                existingRecord.sama = sama;
                existingRecord.rendah = rendah;
                existingRecord.totalSkor = totalSkor;

                await existingRecord.save();
            } else {
                const newRecord = new HasilKeselarasanVertikal({
                    idTracer,
                    id_mahasiswa,
                    tinggi,
                    sama,
                    rendah,
                    totalSkor,
                    tanggal_diperbarui: new Date()
                });

                await newRecord.save();
            }
        }

        return res.status(200).json({
            message: 'Jawaban Saved and Scores Calculated Successfully',
            data: responden
        });

    } catch (error) {
        console.error("Error processing request", error);
        return res.status(500).json({
            message: 'Error processing request',
            error: error.message
        });
    }
};


