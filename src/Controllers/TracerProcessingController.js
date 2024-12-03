const detailKegiatan = require('../Models/TracerStudy/Kegiatan/DetailKegiatanModel');
const Soal = require('../Models/TracerStudy/Kegiatan/SoalModel');
const Kampus = require('../Models/KampusModel');
const Responden = require('../Models/TracerStudy/DataTracer/RespondenModel')
const TracerStudy = require('../Models/TracerStudy/DataTracer/TracerStudyModel');
const AtensiModel = require('../Models/DataProcessing/KeselarasanHorizontal/AtensiModel');
const AtensiModelVertikal = require('../Models/DataProcessing/KeselarasanVertikal/AtensiModel');
const DetailKegiatanModel = require('../Models/TracerStudy/Kegiatan/DetailKegiatanModel');
const HasilKeselarasanVertikal = require('../Models/DataProcessing/KeselarasanVertikal/HasilKeselararasanVertikal')
const hasilKeselarasanHorizontal = require('../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel')
const OutputHorizontal = require('../Models/Output/OutputHorizontalModel')
const OutputVertikal = require('../Models/Output/OutputVertikalModel')
const cron = require('node-cron');
const { default: mongoose } = require('mongoose');




const formatTanggal = (tanggal) => {
    if (!tanggal) return "";
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(tanggal));
};

exports.getTracerStudy = async (req, res) => {
    try {
        const tracer = await TracerStudy.find({ not_delete: true }).populate('id_detail');

        if (!tracer || tracer.length === 0) {
            console.log('Data not Found');
            return res.status(404).json({ message: 'Data not Found' });
        }

        console.log('Data Tracer \n\n',tracer);
        
        const formatTracer = [];
        const today = new Date().toISOString().split('T')[0];

        for (const item of tracer) {
            if (!item.id_detail) {
                console.warn(`Missing id_detail for tracer ID: ${item._id}`);
                continue
            }

            const endDate = new Date(item.id_detail.tanggal_berakhir).toISOString().split('T')[0];

            if (endDate === today && item.status !== 'Selesai') {
                item.status = 'Selesai';
                await item.save(); 
            }

            formatTracer.push({
                _id: item._id,
                id_detail: {
                    _id: item.id_detail._id,
                    nama_kegiatan: item.id_detail.nama_kegiatan,
                    tanggal_mulai: formatTanggal(item.id_detail.tanggal_mulai),
                    tanggal_berakhir: formatTanggal(item.id_detail.tanggal_berakhir),
                },
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                not_delete: item.not_delete,
            });
        }

        console.log("Successfully fetched data", formatTracer);

        return res.status(200).json({
            message: "Successfully fetched data",
            data: formatTracer,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({
            message: "Unable to fetch data",
            error: error.message,
        });
    }
};

exports.getTracerForComming = async (req, res) => {
    try {
        
        const today = new Date();
        const tracer = await TracerStudy.find({ 
            not_delete: true, 
        })
        // .populate('id_detail')
        .populate('id_detail', 'tanggal_mulai');

        console.error('Data Tracer \n\n',tracer);
        console.error(today);
        
        const filteredTracer = tracer.filter(t => t.id_detail && t.id_detail.tanggal_mulai > today);

        console.error('Filter Tracer \n\n',filteredTracer);
        
        if (!filteredTracer || filteredTracer.length === 0) {
            console.log('No upcoming tracer studies found.');
            return res.status(404).json({ message: 'No upcoming tracer studies found.' });
        }

        console.log('Upcoming Tracer Studies:', filteredTracer);

        return res.status(200).json({
            message: 'Upcoming tracer studies fetched successfully.',
            data: filteredTracer
        });

    } catch (error) {
        console.error('Error fetching upcoming tracer studies:', error.message);
        return res.status(500).json({
            message: 'Error fetching tracer studies',
            error: error.message
        });
    }
};

exports.getTracerForBerakhir = async (req, res) => {
    try {
        
        const today = new Date();
        const tracer = await TracerStudy.find({ 
            not_delete: true,
        }).populate('id_detail', 'tanggal_berakhir');

        console.error('Data Tracer \n\n',tracer);
        
        const filteredTracer = tracer.filter(t => t.id_detail && t.id_detail.tanggal_berakhir < today);


        if (!filteredTracer || filteredTracer.length === 0) {
            console.log('No upcoming tracer studies found.');
            return res.status(404).json({ message: 'No upcoming tracer studies found.' });
        }

        console.log('Upcoming Tracer Studies:', filteredTracer);

        return res.status(200).json({
            message: 'Upcoming tracer studies fetched successfully.',
            data: filteredTracer
        });

    } catch (error) {
        console.error('Error fetching upcoming tracer studies:', error.message);
        return res.status(500).json({
            message: 'Error fetching tracer studies',
            error: error.message
        });
    }
};


// require('dotenv').config();

// const crypto = require('crypto')

// const ENCRYPTION_KEY = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex')
// const IV = Buffer.from(process.env.CRYPTO_IV, 'hex')

// function encryptData(data) {
//     const cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, ENCRYPTION_KEY, IV);
//     let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return { encryptedData: encrypted, iv: IV.toString('hex') };
// }

// function decryptData(encryptedData, iv) {
//     const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
//     let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return JSON.parse(decrypted);
// }


// const formatTanggal = (tanggal) => {
//     if (!tanggal) return "";
//     const options = { day: '2-digit', month: 'long', year: 'numeric' };
//     return new Intl.DateTimeFormat('id-ID', options).format(new Date(tanggal));
// };

// exports.getTracerStudy = async (req, res) => {
//     try {
//         const tracer = await TracerStudy.find({ not_delete: true }).populate('id_detail');
        
//         if (!tracer || tracer.length === 0) {
//             console.log('Data not Found');
//             return res.status(404).json({ message: 'Data not Found' });
//         }

//         const formatTracer = [];
//         const today = new Date().toISOString().split('T')[0]; 

//         for (const item of tracer) {
//             const endDate = new Date(item.id_detail.tanggal_berakhir).toISOString().split('T')[0];

//             if (endDate === today && item.status !== 'Selesai') {
//                 item.status = 'Selesai';
//                 await item.save(); 
//             }

//             const plainData = {
//                 _id: item._id,
//                 id_detail: {
//                     _id: item.id_detail._id,
//                     nama_kegiatan: item.id_detail.nama_kegiatan,
//                     tanggal_mulai: formatTanggal(item.id_detail.tanggal_mulai),
//                     tanggal_berakhir: formatTanggal(item.id_detail.tanggal_berakhir),
//                 },
//                 status: item.status,
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt,
//                 not_delete: item.not_delete,
//             };

//             const encryptedData = encryptData(plainData);
//             formatTracer.push(encryptedData);
//         }

//         console.log("Successfully fetched data");

//         return res.status(200).json({
//             message: "Successfully fetched data",
//             data: formatTracer
//         });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         return res.status(500).json({
//             message: "Unable to fetch data",
//             error: error.message,
//         });
//     }
// };

// console.log(crypto.randomBytes(16).toString('hex'));


exports.getById = async (req, res) => {
    try {
        const id = req.params.id_tracer
        const { status } = req.query
        const tracer= await TracerStudy.findById(id).populate('skala_kegiatan.kampus') .populate({
            path: 'skala_kegiatan.prodi',
            populate: {
                path: 'jenjang', 
                select: 'jenjang ' 
            }
        }).populate('id_detail').populate({
            path : 'id_soal',
            select : 'soal jawaban'
        })
        if (!tracer) return res.status(404).json({ message : "Data not Found"})


        if (status) {
            tracer.status = status
            await tracer.save()
            if (!tracer) {
                console.log("Published Failed");
            }
        }

        const formatTracer = {     
                // _id: tracer._id,
                id_detail: {
                    _id: tracer.id_detail._id,
                    nama_kegiatan: tracer.id_detail.nama_kegiatan,
                    tanggal_mulai: formatTanggal(tracer.id_detail.tanggal_mulai),
                    tanggal_berakhir: formatTanggal(tracer.id_detail.tanggal_berakhir),
                    latar_belakang: tracer.id_detail.latar_belakang,
                    tujuan_kegiatan: tracer.id_detail.tujuan_kegiatan,
                    manfaat_kegiatan: tracer.id_detail.manfaat_kegiatan
                    
                },
                skala_kegiatan: {
                    skala_kegiatan: tracer.skala_kegiatan.skala_kegiatan,
                    tahun_lulusan: tracer.skala_kegiatan.tahun_lulusan,
                    kampus: tracer.skala_kegiatan.kampus,
                    prodi: tracer.skala_kegiatan.prodi.map(prodi => ({
                        _id: prodi._id,
                        kode: prodi.kode,
                        nama: prodi.nama,
                        jenjang: prodi.jenjang.jenjang
                    }))
                },
                soal : {
                    id_soal : tracer.id_soal,
                    soal : tracer.soal,
                    jawaban : [
                        {
                            jawaban : tracer.jawaban,
                            bobot : tracer.bobot_jawaban
                        }
                    ]

                },
                status: tracer.status,
                createdAt: tracer.createdAt,
                updatedAt: tracer.updatedAt
            
        };
    
        return res.status(200).json({ message : "Succesfully get Data", data : formatTracer})
    } catch (error) {
        console.log("Unable to get Data", error);
        
        return res.status(500).json({
            message : "Unable to get Data",
            error : error
        })
    }
}





exports.published = async (req, res) => {
    const { id } = req.params;
    const { status } = req.query;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const validStatuses = ['Draft', 'Berlangsung', 'Selesai', 'Dibatalkan'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status value. Allowed values: ${validStatuses.join(", ")}.`,
            });
        }

        const tracer = await TracerStudy.findById(id);

        if (!tracer) {
            return res.status(404).json({ message: "Tracer Study not found" });
        }

        tracer.status = status;

        if (status === 'Berlangsung') {
            tracer.publishAt = new Date();
        }

        await tracer.save();

        return res.status(200).json({
            message: "Successfully updated status",
            data: tracer,
        });
    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            message: "Unable to update status",
            error: error.message,
        });
    }
};



// ================== Step 1 Tambah Detail Kegiatan ===================

exports.addDetailKegiatan = async (req, res) => {
    try {
        const { banner, nama_kegiatan, tanggal_mulai, tanggal_berakhir, latar_belakang, tujuan_kegiatan, manfaat_kegiatan } = req.body;
        const data = { nama_kegiatan, tanggal_mulai, tanggal_berakhir };
        if (!data) {
            console.log("Data required");
            return res.status(400).json({ message: "Data Required" });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "User ID missing from token" });
        }

        const detail = new detailKegiatan(req.body);
        await detail.save();

        console.log("Detail Saved");

        
        
        const tracerStudy = new TracerStudy({ id_detail: detail._id });
        tracerStudy.id_pengguna = userId
        await tracerStudy.save();

        console.log("Detail Saved to Tracer ");
        

        return res.status(200).json({
            message: "Successfully added",
            data: {
                data_detail: detail,
                id_tracer: tracerStudy._id
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to add Data", error: error.message });
    }
}





// ================== Step 2 Tambah Skala Kegiatan ===================


exports.addSkalaKegiatan = async (req, res) => {
    try {

        const id_tracer = req.params.id
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const { skala_kegiatan, tahun_lulusan, kampus, prodi } = req.body;

        if (!skala_kegiatan || !tahun_lulusan || !kampus || !prodi) {
            return res.status(400).json({ message: "Data Required" });
        }

        const skala = await TracerStudy.findById(id_tracer);

        if (!skala) return res.status(404).json({ message: "ID Data not found" });


        skala.skala_kegiatan.skala_kegiatan = skala_kegiatan;
        skala.skala_kegiatan.tahun_lulusan = tahun_lulusan;
        skala.skala_kegiatan.kampus = kampus;
        skala.skala_kegiatan.prodi = prodi;

        await skala.save();

        return res.status(200).json({ message: "Successfully Added", data: skala });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to add Skala kegiatan", error: error.message });
    }
};


// ================== Step 3 Tambah Soal ===================


exports.addSoal = async (req, res) => {
    try {
        const id_tracer = req.params.id;

        if (!mongoose.isValidObjectId(id_tracer)) {
            console.log("Invalid ID Format");
            
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const tracerStudy = await TracerStudy.findById(id_tracer);
        if (!tracerStudy) {
            console.log("Id tidak ditemukan");
            return res.status(404).json({ message: "Id tidak ditemukan" });
        }

        const { soal, jawaban } = req.body;
        if (!soal || !jawaban) {
            console.log( "Data soal dan jawaban wajib diisi");
            
            return res.status(400).json({ message: "Data soal dan jawaban wajib diisi" });
        }

        const newSoal = new Soal({ soal, jawaban });
        await newSoal.save();

        console.log("New Soal Saved");
        
        const updatedTracerStudy = await TracerStudy.findByIdAndUpdate(
            id_tracer,
            { $push: { id_soal: newSoal._id } },
            { new: true, runValidators: true }
        );

        if (!updatedTracerStudy) {
            return res.status(500).json({ message: "Gagal memperbarui data TracerStudy" });
        }

        console.log("Successfully added Data");
        
        return res.status(200).json({
            message: "Successfully added Data",
            data: {
                soal_detail: newSoal,
                tracer_study: updatedTracerStudy
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Unable to Add", error: error.message });
    }
};

exports.getBankSoal = async (req, res) => {
    try {
        const id_tracer = req.params.id
        const data = await TracerStudy.findById(id_tracer).populate('id_soal')
        if (!data){
            console.log("Soal Not Found");
            return res.status(404).json({
                message : "Soal not Found"
            })
        }

        const soalArray = Array.isArray(data.id_soal) ? data.id_soal : [data.id_soal];

        const soalData = soalArray.map(soal => ({
            id_soal: soal._id,
            soal: soal.soal || "",
            jawaban: soal.jawaban || []
        }));


        return res.status(200).json({
            message : "Succesfully get Soal",
            data : soalData
        })
    } catch (error) {
        console.log("Unable to get", error);
        return res.status(500).json({
            message : "Unable to get",
            error : error.message || error
        })
    }
}


exports.updateSoal = async (req, res) => {
    try {
        const id_soal = req.params.id

        if (!mongoose.isValidObjectId(id_soal)) {
            console.log("Invalid ID Format");
            
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const dataSoal = req.body
        if(!id_soal || !dataSoal) {
            console.log("Required Data or ID");
            return res.status(400).json({
                message : "Required Data or ID"
            })
            
        }
        const data = await Soal.findByIdAndUpdate(id_soal, dataSoal , { new : true, runValidators : true})


        const tracerStudyUpdate = await TracerStudy.updateMany(
            { 'id_soal': id_soal },
            { $set: { 'id_soal.$': data._id } }, 
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message : "Succesfully Edit Tracer",
            data : data,
            tracer_study_terkait: tracerStudyUpdate
        })
    } catch (error) {
        console.log("Unable to update", error);
        return res.status(500).json({
            message : "Unable to update",
            error : error.message || error
        })
        
    }
}



exports.deleteSoal = async (req, res) => {
    try {
        const id_soal = req.params.id

        if (!id_soal) {
            console.log("ID soal tidak ditemukan");
            return res.status(400).json({ message: "ID soal tidak ditemukan" });
        }

        if (!mongoose.isValidObjectId(id_soal)) {
            return res.status(400).json({ message: "Format ID soal tidak valid" });
        }

        const soal = await Soal.findByIdAndDelete(id_soal);
        if (!soal) {
            return res.status(404).json({ message: "Soal tidak ditemukan" });
        }

        const tracerStudyUpdate = await TracerStudy.updateMany(
            { id_soal: id_soal },
            { $pull: { id_soal: id_soal } }
        );

        return res.status(200).json({
            message: "Berhasil menghapus soal",
            data: {
                soal_dihapus: soal,
                tracer_study_terkait: tracerStudyUpdate
            }
        });
    } catch (error) {
        console.error("Error saat menghapus soal:", error);
        return res.status(500).json({ message: "Gagal menghapus soal", error: error.message });
    }
};




// ================== Step 3 Apply Kriteria ===================


exports.addKriteriaAtensi = async (req, res) => {
    try {
        const id_tracer = req.params.id;

        if (!mongoose.isValidObjectId(id_tracer)) {
            return res.status(400).json({ message: "Invalid Tracer ID" });
        }

        const { atensi_horizontal, atensi_vertikal } = req.body;

        if (!atensi_horizontal || !atensi_vertikal) {
            return res.status(400).json({ message: "Atensi IDs are required" });
        }

        const validHorizontalIds = atensi_horizontal.every(id => mongoose.isValidObjectId(id));
        const validVertikalIds = atensi_vertikal.every(id => mongoose.isValidObjectId(id));

        if (!validHorizontalIds || !validVertikalIds) {
            return res.status(400).json({ message: "Invalid Atensi IDs" });
        }

        const updatedTracerStudy = await TracerStudy.findByIdAndUpdate(id_tracer, {
            $push: {
                "atensi.atensi_horizontal": { $each: atensi_horizontal},
                "atensi.atensi_vertikal": { $each: atensi_vertikal}
            }
        }, { new: true, runValidators: true });

        if (!updatedTracerStudy) {
            return res.status(404).json({
                message: "Tracer Study ID Not Found"
            });
        }

        console.log('Successfully Applied Kriteria Atensi');
        

        return res.status(200).json({
            message: "Successfully Applied Kriteria Atensi",
            data: updatedTracerStudy
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Unable to Apply Kriteria" });
    }
};




exports.getKegiatan = async (req, res) => {
    try {
        const kegiatan = await detailKegiatan.find()
        if(!kegiatan) return res.status(404).json({ message: "Data Kegiatan not found"})
        return res.status(200).json({ message : "Succesfully get Kegiatan", data : kegiatan})
    } catch (error){
        console.log(error);
        return res.status(500).json({ message : "Unable to get Kegiatan"})
    }
}

exports.getTracerStudyById = async (req, res) => {
    const { id } = req.params.id;

    try {
        const tracerStudy = await TracerStudy.findById(id)
            .populate('id_detail')
            .populate('skala_kegiatan.tahun_lulusan')
            .populate('skala_kegiatan.kampus')
            .populate('skala_kegiatan.prodi')
            .populate('id_soal')
            .populate('id_responden')
            .populate('atensi.atensi_horizontal')
            .populate('atensi.atensi_vertikal');

        if (!tracerStudy) {
            return res.status(404).json({ message: 'Tracer Study not found' });
        }

        const detail_kegiatan = await detailKegiatan.findById(tracerStudy.id_detail);

        if (!detail_kegiatan) {
            return res.status(404).json({ message: 'Detail Kegiatan not found' });
        }

        const header = {
            banner: detail_kegiatan.banner,
            nama_kegiatan: detail_kegiatan.nama_kegiatan,
            tanggal_mulai: detail_kegiatan.tanggal_mulai,
            tanggal_berakhir: detail_kegiatan.tanggal_berakhir,
            status: tracerStudy.status,
            publishAt: tracerStudy.publishAt,
            createdAt: tracerStudy.createdAt,
            updatedAt: tracerStudy.updatedAt,
            id_pengguna: tracerStudy.id_pengguna
        };

        const detail = {
            id_detail: tracerStudy.id_detail,
            skala_kegiatan: tracerStudy.skala_kegiatan,
        };

        const kuesioner = {
            id_soal: tracerStudy.id_soal,
        };

        const responden = {
            id_responden: tracerStudy.id_responden,
        };

        return res.json({
            header,
            detail,
            kuesioner,
            responden,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Unable get Detail Kegiatan' });
    }
};


const editDetailKegiatan = async (id_tracer, body) => {
    try {
        const dataTracer = await TracerStudy.findOne({ id_detail: id_tracer });
        const dataDetail = await DetailKegiatanModel.findById(id_tracer);

        if (!dataTracer || !dataDetail) {
            console.error("Data not found");
            return {
                status: 404,
                message: "Data TracerStudy or DetailKegiatan not found",
            };
        }

        const updateDetail = await DetailKegiatanModel.findByIdAndUpdate(
            id_tracer,
            body,
            { new: true, runValidators: true }
        );

        if (!updateDetail) {
            console.error("Failed to edit");
            return {
                status: 400,
                message: "Failed to edit",
            };
        }

        return {
            status: 200,
            message: "Successfully edited DetailKegiatan",
            data: updateDetail,
        };
    } catch (error) {
        console.error("Unable to edit DetailKegiatan", error);
        return {
            status: 500,
            message: "Unable to edit DetailKegiatan",
        };
    }
};

const editSkalaKegiatan = async (id, body) => {
    try {
        const dataTracer = await TracerStudy.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!dataTracer) {
            console.error("Failed to edit SkalaKegiatan");
            return {
                status: 400,
                message: "Failed to edit SkalaKegiatan",
            };
        }

        return {
            status: 200,
            message: "Successfully edited SkalaKegiatan",
            data : dataTracer
        };
    } catch (error) {
        console.error("Unable to edit SkalaKegiatan", error);
        return {
            status: 500,
            message: "Unable to edit SkalaKegiatan",
        };
    }
};

exports.editTracerStudyById = async (req, res) => {
    const id = req.params.id; 
    const body = req.body;

    try {

        if (body.hasOwnProperty("status")) {
            console.error("Editing status is not allowed");
            return {
                status: 400,
                message: "Editing status is not allowed",
            };
        }

        let result;

        const isDetail = await DetailKegiatanModel.findById(id);
        if (isDetail) {
            result = await editDetailKegiatan(id, body);
        } else {
            const isTracer = await TracerStudy.findById(id);
            if (isTracer) {
                result = await editSkalaKegiatan(id, body);
            } else {

                return res.status(404).json({
                    message: "ID not found in either DetailKegiatan or TracerStudy",
                });
            }
        }

        if (result.status !== 200) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error("Error editing Tracer Study:", error);
        return res.status(500).json({
            message: "Unable to edit Tracer Study",
        });
    }
};



// exports.editTracerStudyById = async (req, res) => {
//     const { id } = req.params;
//     const updates = req.body;

//     try {

//         const tracerStudy = await TracerStudy.findById(id);

//         if (!tracerStudy) {
//             return res.status(404).json({ message: "Tracer Study not found" });
//         }


//         if (["Selesai", "Dibatalkan"].includes(tracerStudy.status)) {
//             return res.status(400).json({ message: "Cannot edit Tracer Study with status 'Selesai' or 'Dibatalkan'" });
//         }

//         Object.keys(updates).forEach((key) => {
//             tracerStudy[key] = updates[key];
//         });

//         await tracerStudy.save();

//         const detail_kegiatan = tracerStudy.id_detail
//             ? await detailKegiatan.findById(tracerStudy.id_detail).select(
//                   "banner nama_kegiatan tanggal_mulai tanggal_berakhir"
//               )
//             : null;

//         const response = {
//             header: {
//                 banner: detail_kegiatan?.banner || null,
//                 nama_kegiatan: detail_kegiatan?.nama_kegiatan || null,
//                 tanggal_mulai: detail_kegiatan?.tanggal_mulai || null,
//                 tanggal_berakhir: detail_kegiatan?.tanggal_berakhir || null,
//                 status: tracerStudy.status,
//                 publishAt: tracerStudy.publishAt,
//                 createdAt: tracerStudy.createdAt,
//                 updatedAt: tracerStudy.updatedAt,
//             },
//             detail: {
//                 id_detail: tracerStudy.id_detail,
//                 skala_kegiatan: tracerStudy.skala_kegiatan,
//             },
//             kuesioner: {
//                 id_soal: tracerStudy.id_soal,
//             },
//             responden: {
//                 id_responden: tracerStudy.id_responden,
//             },
//         };

//         return res.status(200).json({
//             message: "Tracer Study updated successfully",
//             data: response,
//         });
//     } catch (error) {
//         console.error("Error updating Tracer Study:", error);
//         return res.status(500).json({ message: "Unable to update Tracer Study", error: error.message });
//     }
// };



// exports.editTracerStudyById = async (req, res) => {
//     const { id } = req.params;
//     const {
//         id_detail,
//         skala_kegiatan,
//         id_soal,
//         id_responden,
//         status,
//         publishAt
//     } = req.body;

//     try {
       
//         const tracerStudy = await TracerStudy.findById(id)
//             .populate("id_detail", "banner nama_kegiatan tanggal_mulai tanggal_berakhir")
//             .populate("id_soal", "soal jawaban");

//         if (!tracerStudy) {
//             return res.status(404).json({ message: "Tracer Study not found" });
//         }

//         if (["Selesai", "Dibatalkan"].includes(tracerStudy.status)) {
//             return res.status(400).json({ message: "Cannot edit Tracer Study with status 'Selesai' or 'Dibatalkan'" });
//         }

//         if (id_detail) tracerStudy.id_detail = id_detail;
//         if (skala_kegiatan) tracerStudy.skala_kegiatan = skala_kegiatan;
//         if (id_soal) tracerStudy.id_soal = id_soal;
//         if (id_responden) tracerStudy.id_responden = id_responden;
//         if (status) tracerStudy.status = status;
//         if (publishAt) tracerStudy.publishAt = new Date(publishAt); 

//         // Simpan perubahan
//         await tracerStudy.save();

//         // Ambil detail kegiatan untuk respon
//         const detail_kegiatan = await detailKegiatan.findById(tracerStudy.id_detail);

//         // Strukturkan data untuk respons
//         const header = {
//             banner: detail_kegiatan?.banner || null,
//             nama_kegiatan: detail_kegiatan?.nama_kegiatan || null,
//             tanggal_mulai: detail_kegiatan?.tanggal_mulai || null,
//             tanggal_berakhir: detail_kegiatan?.tanggal_berakhir || null,
//             status: tracerStudy.status,
//             publishAt: tracerStudy.publishAt,
//             createdAt: tracerStudy.createdAt,
//             updatedAt: tracerStudy.updatedAt,
//         };

//         const detail = {
//             id_detail: tracerStudy.id_detail,
//             skala_kegiatan: tracerStudy.skala_kegiatan,
//         };

//         const kuesioner = {
//             id_soal: tracerStudy.id_soal,
//         };

//         const responden = {
//             id_responden: tracerStudy.id_responden,
//         };

//         // Kembalikan data yang telah diperbarui
//         return res.status(200).json({
//             message: "Tracer Study updated successfully",
//             header,
//             detail,
//             kuesioner,
//             responden,
//         });
//     } catch (error) {
//         console.error("Error updating Tracer Study:", error);
//         return res.status(500).json({ message: "Unable to update Tracer Study", error: error.message });
//     }
// };


exports.deleteTracer = async (req, res) => {
    try {
        const id = req.params.id
        if(!id) {
            console.log('Tracer Not Found');
        }

        const tracer = await TracerStudy.findById(id)

        if(!tracer) {
            console.log('Failed Delete Tracer');
        }
        tracer.not_delete = false
        await tracer.save()
        
        return res.status(200).json({
            message : "Data Tracer Deleted"
        })

    } catch (error) {
        console.log('Unable Tracer Deleted');
        return res.status(500).json({
            message : "Unable Tracer Deleted"
        })
    }
}








// ==================== Data process ====================
//Step 1


exports.calculateScores = async ( req, res) => {

    const idTracer = req.params.id
    try {

        const tracer = await TracerStudy.findById(idTracer).populate('atensi.atensi_horizontal')

        if(!tracer) {
            console.log("Tracer Study Doesn't Match");
            return res.status(400).message({ message : "Tracer Study Doesn't Match"})
        }

        // const output = 
        const respondenCount = await Responden.countDocuments();
        if (respondenCount === 0) {
            console.info('No responden data available.');
            return;
        }

        
        const latestRespondenData = await Responden.findOne()
            .sort({ updatedAt: -1 })
            .populate({
                path: 'jawaban.id_soal',
                select: 'soal jawaban'
            })
            .populate({
                path: 'id_mahasiswa',
                select: '_id'
            });


        if (!latestRespondenData) {
            console.info('No new responden data found');
            return;
        }


        let tinggi = 0, sama = 0, rendah = 0;
        let totalSkor = 0;

        const id_mahasiswa = latestRespondenData.id_mahasiswa?._id;
        const updatedAt = latestRespondenData.updatedAt;

        const existingRecord = await HasilKeselarasanVertikal.findOne({ id_mahasiswa, idTracer });


        if (existingRecord && new Date(existingRecord.tanggal_diperbarui) >= updatedAt) {
            console.info('Data is already up-to-date.');
            return;
        }

        for (const jawabanResponden of latestRespondenData.jawaban) {
            const soal = jawabanResponden.id_soal;
            const jawabanPilih = jawabanResponden.jawaban;

            const jawab = soal?.jawaban.find(jawaban => jawaban.jawaban === jawabanPilih);

            if (!jawab) continue;

            const bobot = jawab.bobot_jawaban;

            if (bobot >= 4) {
                tinggi += bobot;
            } else if (bobot === 3) {
                sama += bobot;
            } else if (bobot <= 2) {
                rendah += bobot;
            }

            totalSkor += bobot;
        }

        if (existingRecord) {
            existingRecord.tanggal_diperbarui = new Date();
            existingRecord.tinggi = tinggi;
            existingRecord.sama = sama;
            existingRecord.rendah = rendah;
            existingRecord.totalSkor = totalSkor;

            await existingRecord.save();
            console.info('Data updated successfully');
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
            console.info('Data saved successfully');
        }

        console.info({
            idTracer,
            id_mahasiswa,
            tinggi,
            sama,
            rendah,
            totalSkor
        });

    } catch (error) {
        console.error("Error calculating scores:", error.message);
    }
};

// cron.schedule('0 2 * * *', () => {
//     console.log('Running score calculation...');
//     calculateScores();
// });

// calculateScores();



//Step 2

exports.generateReportHorizontal = async (req, res) => {
    try {
        const hasil = await hasilKeselarasanHorizontal.find()

        .populate({
            path: 'id_mahasiswa',
            select: 'kampus',
            populate: [
                {
                    path: 'kampus.prodi', 
                    select: 'nama jenjang', 
                    populate: {
                        path: 'jenjang',
                        select: 'jenjang' 
                    }
                },
                {
                    path: 'kampus.kampus', 
                    select: 'psdku' 
                },
                {
                    path: 'kampus.tahun_lulusan',
                    select: 'tahun_lulusan' 
                }
            ]
        });
            // .populate({
            //     path: 'id_mahasiswa',
            //     select: 'kampus',
            //     populate: {
            //         path: 'kampus.prodi kampus.kampus kampus.tahun_lulusan kampus.prodi.jenjang',
            //         select: 'nama psdku tahun_lulusan jenjang' 
            //     }
            // });

            // return res.json({
            //     data : hasil
            // })
        console.log(hasil);

        if (!hasil || hasil.length === 0) {
            console.error("No data found in Hasil Keselarasan Horizontal");
            return res.status(404).json({
                message: "No data found in Hasil Keselarasan Horizontal"
            });
        }

        const outputData = hasil.reduce((acc, item) => {
            const mahasiswa = item.id_mahasiswa;

            if (mahasiswa && mahasiswa.kampus && mahasiswa.kampus.prodi && mahasiswa.kampus.kampus && mahasiswa.kampus.tahun_lulusan) {
                const { prodi, kampus, tahun_lulusan } = mahasiswa.kampus;

                const tahunLulusanValue = tahun_lulusan.tahun_lulusan; 

                let existing = acc.find(data =>
                    data.prodi.toString() === prodi.toString() &&
                    data.kampus.toString() === kampus.toString() &&
                    data.tahun_lulusan === tahunLulusanValue
                );

                if (!existing) {
                    existing = {
                        prodi,
                        kampus,
                        tahun_lulusan: tahunLulusanValue,
                        jenjang: mahasiswa.kampus.prodi.jenjang.jenjang || "Tidak Diketahui",
                        keselarasan: {
                            selaras: { jumlah: 0, persentase: "0%" },
                            tidak_selaras: { jumlah: 0, persentase: "0%" }
                        }
                    };
                    acc.push(existing);
                }

                if (item.selaras) {
                    existing.keselarasan.selaras.jumlah += 1;
                } else {
                    existing.keselarasan.tidak_selaras.jumlah += 1;
                }
            }
            return acc;
        }, []);

        outputData.forEach(data => {
            const total = data.keselarasan.selaras.jumlah + data.keselarasan.tidak_selaras.jumlah;
            if (total > 0) {
                data.keselarasan.selaras.persentase = ((data.keselarasan.selaras.jumlah / total) * 100).toFixed(2) + "%";
                data.keselarasan.tidak_selaras.persentase = ((data.keselarasan.tidak_selaras.jumlah / total) * 100).toFixed(2) + "%";
            }
        });

        const savedOutput = await OutputHorizontal.insertMany(outputData);

        return res.status(200).json({
            message: "Data successfully processed and saved to Output Horizontal",
            data: savedOutput
        });
    } catch (error) {
        console.error("Error processing data", error.message);
        return res.status(500).json({
            message: "Error processing data",
            error: error.message
        });
    }
};


exports.generateReportVertikal = async (req, res) => {
    const id_tracer = req.params.id;

    try {
        const hasilKeselarasan = await HasilKeselarasanVertikal.findById(id_tracer)
            .populate({
                path: 'id_mahasiswa',
                select: 'kampus',
                populate: [
                    {
                        path: 'kampus.prodi',
                        select: 'nama jenjang',
                        populate: {
                            path: 'jenjang',
                            select: 'jenjang'
                        }
                    },
                    {
                        path: 'kampus.kampus',
                        select: 'psdku'
                    },
                    {
                        path: 'kampus.tahun_lulusan',
                        select: 'tahun_lulusan'
                    }
                ]
            });

        if (!hasilKeselarasan) {
            return res.status(404).json({
                message: 'No data found in Hasil Keselarasan Vertikal'
            });
        }

        const result = hasilKeselarasan.reduce((acc, item) => {
            const mahasiswa = item.id_mahasiswa;
            if (!mahasiswa || !mahasiswa.kampus) return acc;

            const { prodi, tahun_lulusan, jenjang } = mahasiswa.kampus;
            const key = `${prodi?.toString()}-${tahun_lulusan?.toString()}-${jenjang?.toString()}`;

            if (!acc[key]) {
                acc[key] = {
                    tahun_lulusan: tahun_lulusan?.tahun_lulusan || "Tidak Diketahui",
                    jenjang: jenjang?.jenjang || "Tidak Diketahui",
                    prodi: prodi?.nama || "Tidak Diketahui",
                    keselarasan: {
                        tinggi: { jumlah: 0, persentase: '0%' },
                        sama: { jumlah: 0, persentase: '0%' },
                        rendah: { jumlah: 0, persentase: '0%' }
                    }
                };
            }

            const group = acc[key];
            group.keselarasan.tinggi.jumlah += item.tinggi || 0;
            group.keselarasan.sama.jumlah += item.sama || 0;
            group.keselarasan.rendah.jumlah += item.rendah || 0;

            return acc;
        }, {});

        const outputData = Object.values(result).map(group => {
            const total = group.keselarasan.tinggi.jumlah +
                          group.keselarasan.sama.jumlah +
                          group.keselarasan.rendah.jumlah;

            if (total > 0) {
                group.keselarasan.tinggi.persentase = ((group.keselarasan.tinggi.jumlah / total) * 100).toFixed(2) + '%';
                group.keselarasan.sama.persentase = ((group.keselarasan.sama.jumlah / total) * 100).toFixed(2) + '%';
                group.keselarasan.rendah.persentase = ((group.keselarasan.rendah.jumlah / total) * 100).toFixed(2) + '%';
            }

            return group;
        });

        const savedOutput = await OutputVertikal.insertMany(outputData);

        return res.status(200).json({
            message: 'Data successfully processed and saved to Output Vertikal',
            data: savedOutput
        });
    } catch (error) {
        console.error('Error processing data', error.message);
        return res.status(500).json({
            message: 'Error processing data',
            error: error.message
        });
    }
};


exports.generateReport = async (req, res) => {
    const id_tracer = req.params.id;

    try {
      
        const hasilKeselarasanVertikal = await HasilKeselarasanVertikal.findById(id_tracer)
            .populate({
                path: 'id_mahasiswa',
                select: 'kampus',
                populate: [
                    {
                        path: 'kampus.prodi',
                        select: 'nama jenjang',
                        populate: { path: 'jenjang', select: 'jenjang' }
                    },
                    { path: 'kampus.kampus', select: 'psdku' },
                    { path: 'kampus.tahun_lulusan', select: 'tahun_lulusan' }
                ]
            });

        if (!hasilKeselarasanVertikal) {
            return res.status(404).json({
                message: 'No data found in Hasil Keselarasan Vertikal'
            });
        }

        const vertikalResult = hasilKeselarasanVertikal.reduce((acc, item) => {
            const mahasiswa = item.id_mahasiswa;
            if (!mahasiswa || !mahasiswa.kampus) return acc;

            const { prodi, tahun_lulusan, jenjang } = mahasiswa.kampus;
            const key = `${prodi?.toString()}-${tahun_lulusan?.toString()}-${jenjang?.toString()}`;

            if (!acc[key]) {
                acc[key] = {
                    tahun_lulusan: tahun_lulusan?.tahun_lulusan || "Tidak Diketahui",
                    jenjang: jenjang?.jenjang || "Tidak Diketahui",
                    prodi: prodi?.nama || "Tidak Diketahui",
                    keselarasan: {
                        tinggi: { jumlah: 0, persentase: '0%' },
                        sama: { jumlah: 0, persentase: '0%' },
                        rendah: { jumlah: 0, persentase: '0%' }
                    }
                };
            }

            const group = acc[key];
            group.keselarasan.tinggi.jumlah += item.tinggi || 0;
            group.keselarasan.sama.jumlah += item.sama || 0;
            group.keselarasan.rendah.jumlah += item.rendah || 0;

            return acc;
        }, {});

        const vertikalOutput = Object.values(vertikalResult).map(group => {
            const total = group.keselarasan.tinggi.jumlah +
                          group.keselarasan.sama.jumlah +
                          group.keselarasan.rendah.jumlah;

            if (total > 0) {
                group.keselarasan.tinggi.persentase = ((group.keselarasan.tinggi.jumlah / total) * 100).toFixed(2) + '%';
                group.keselarasan.sama.persentase = ((group.keselarasan.sama.jumlah / total) * 100).toFixed(2) + '%';
                group.keselarasan.rendah.persentase = ((group.keselarasan.rendah.jumlah / total) * 100).toFixed(2) + '%';
            }

            return group;
        });

        const hasilKeselarasanHorizontal = await hasilKeselarasanHorizontal.find()
            .populate({
                path: 'id_mahasiswa',
                select: 'kampus',
                populate: [
                    {
                        path: 'kampus.prodi',
                        select: 'nama jenjang',
                        populate: { path: 'jenjang', select: 'jenjang' }
                    },
                    { path: 'kampus.kampus', select: 'psdku' },
                    { path: 'kampus.tahun_lulusan', select: 'tahun_lulusan' }
                ]
            });

        if (!hasilKeselarasanHorizontal || hasilKeselarasanHorizontal.length === 0) {
            console.error("No data found in Hasil Keselarasan Horizontal");
            return res.status(404).json({
                message: "No data found in Hasil Keselarasan Horizontal"
            });
        }

        const validKeys = Object.keys(vertikalResult);
        const horizontalFiltered = hasilKeselarasanHorizontal.filter(item => {
            const mahasiswa = item.id_mahasiswa;
            if (!mahasiswa || !mahasiswa.kampus) return false;

            const { prodi, tahun_lulusan, jenjang } = mahasiswa.kampus;
            const key = `${prodi?.toString()}-${tahun_lulusan?.toString()}-${jenjang?.toString()}`;
            return validKeys.includes(key);
        });


        const horizontalOutput = horizontalFiltered.reduce((acc, item) => {
            const mahasiswa = item.id_mahasiswa;
            if (!mahasiswa || !mahasiswa.kampus) return acc;

            const { prodi, kampus, tahun_lulusan } = mahasiswa.kampus;
            const tahunLulusanValue = tahun_lulusan.tahun_lulusan;

            let existing = acc.find(data =>
                data.prodi.toString() === prodi.toString() &&
                data.kampus.toString() === kampus.toString() &&
                data.tahun_lulusan === tahunLulusanValue
            );

            if (!existing) {
                existing = {
                    prodi,
                    kampus,
                    tahun_lulusan: tahunLulusanValue,
                    jenjang: mahasiswa.kampus.prodi.jenjang.jenjang || "Tidak Diketahui",
                    keselarasan: {
                        selaras: { jumlah: 0, persentase: "0%" },
                        tidak_selaras: { jumlah: 0, persentase: "0%" }
                    }
                };
                acc.push(existing);
            }

            if (item.selaras) {
                existing.keselarasan.selaras.jumlah += 1;
            } else {
                existing.keselarasan.tidak_selaras.jumlah += 1;
            }

            return acc;
        }, []);

        horizontalOutput.forEach(data => {
            const total = data.keselarasan.selaras.jumlah + data.keselarasan.tidak_selaras.jumlah;
            if (total > 0) {
                data.keselarasan.selaras.persentase = ((data.keselarasan.selaras.jumlah / total) * 100).toFixed(2) + "%";
                data.keselarasan.tidak_selaras.persentase = ((data.keselarasan.tidak_selaras.jumlah / total) * 100).toFixed(2) + "%";
            }
        });

        const savedVertikal = await OutputVertikal.insertMany(vertikalOutput);
        const savedHorizontal = await OutputHorizontal.insertMany(horizontalOutput);

        return res.status(200).json({
            message: "Data successfully processed and saved",
            vertikalData: savedVertikal,
            horizontalData: savedHorizontal
        });
    } catch (error) {
        console.error("Error processing data", error.message);
        return res.status(500).json({
            message: "Error processing data",
            error: error.message
        });
    }
};



// exports.generateReportVertikal = async (req, res) => {
    
//     const id_tracer = req.params.id
//     try {
      
//         const hasilKeselarasan = await HasilKeselarasanVertikal.findById(id_tracer)
//         .populate({
//             path: 'id_mahasiswa',
//             select: 'kampus',
//             populate: [
//                 {
//                     path: 'kampus.prodi', 
//                     select: 'nama jenjang', 
//                     populate: {
//                         path: 'jenjang',
//                         select: 'jenjang' 
//                     }
//                 },
//                 {
//                     path: 'kampus.kampus', 
//                     select: 'psdku' 
//                 },
//                 {
//                     path: 'kampus.tahun_lulusan',
//                     select: 'tahun_lulusan' 
//                 }
//             ]
//         });

            

//         if (!hasilKeselarasan || hasilKeselarasan.length === 0) {
//             return res.status(404).json({
//                 message: 'No data found in Hasil Keselarasan Vertikal'
//             });
//         }

        
//         const result = hasilKeselarasan.reduce((acc, item) => {
//             const mahasiswa = item.id_mahasiswa;
//             if (!mahasiswa || !mahasiswa.kampus) return acc;

//             const { prodi, tahun_lulusan, jenjang } = mahasiswa.kampus;
//             const key = `${prodi}-${tahun_lulusan}-${jenjang}`;

            
//             let group = acc[key];
//             if (!group) {
//                 group = {
//                     tahun_lulusan,
//                     jenjang,
//                     prodi,
//                     keselarasan: {
//                         tinggi: { jumlah: 0, persentase: '0%' },
//                         sama: { jumlah: 0, persentase: '0%' },
//                         rendah: { jumlah: 0, persentase: '0%' }
//                     }
//                 };
//                 acc[key] = group;
//             }

           
//             if (item.tinggi) group.keselarasan.tinggi.jumlah += item.tinggi;
//             if (item.sama) group.keselarasan.sama.jumlah += item.sama;
//             if (item.rendah) group.keselarasan.rendah.jumlah += item.rendah;

//             return acc;
//         }, {});

        
//         const outputData = Object.values(result).map((group) => {
//             const total =
//                 group.keselarasan.tinggi.jumlah +
//                 group.keselarasan.sama.jumlah +
//                 group.keselarasan.rendah.jumlah;

//             if (total > 0) {
//                 group.keselarasan.tinggi.persentase = ((group.keselarasan.tinggi.jumlah / total) * 100).toFixed(2) + '%';
//                 group.keselarasan.sama.persentase = ((group.keselarasan.sama.jumlah / total) * 100).toFixed(2) + '%';
//                 group.keselarasan.rendah.persentase = ((group.keselarasan.rendah.jumlah / total) * 100).toFixed(2) + '%';
//             }

//             return group;
//         });

//         const savedOutput = await OutputVertikal.insertMany(outputData);

//         return res.status(200).json({
//             message: 'Data successfully processed and saved to Output Vertikal',
//             data: savedOutput
//         });
//     } catch (error) {
//         console.error('Error processing data', error.message);
//         return res.status(500).json({
//             message: 'Error processing data',
//             error: error.message
//         });
//     }
// };



// exports.generateReport = async (req, res) => {
//     const { type, id_tracer } = req.params; // 'horizontal' atau 'vertikal'

//     try {
//         let hasilKeselarasan;
//         if (type === 'horizontal') {
//             hasilKeselarasan = await hasilKeselarasanHorizontal.find()
//                 .populate({
//                     path: 'id_mahasiswa',
//                     select: 'kampus',
//                     populate: {
//                         path: 'kampus.prodi kampus kampus.tahun_lulusan',
//                         select: 'prodi kampus tahun_lulusan jenjang'
//                     }
//                 });
//         } else if (type === 'vertikal') {
//             hasilKeselarasan = await HasilKeselarasanVertikal.findById(id_tracer)
//                 .populate({
//                     path: 'id_mahasiswa',
//                     select: 'kampus',
//                     populate: {
//                         path: 'kampus.prodi kampus.tahun_lulusan kampus.jenjang',
//                         select: 'prodi tahun_lulusan jenjang'
//                     }
//                 });
//         }

//         if (!hasilKeselarasan || hasilKeselarasan.length === 0) {
//             return res.status(404).json({
//                 message: `No data found in Hasil Keselarasan ${type === 'horizontal' ? 'Horizontal' : 'Vertikal'}`
//             });
//         }

//         let outputData;
//         if (type === 'horizontal') {
//             outputData = hasilKeselarasan.reduce((acc, item) => {
//                 const mahasiswa = item.id_mahasiswa;

//                 if (mahasiswa && mahasiswa.kampus && mahasiswa.kampus.prodi && mahasiswa.kampus.kampus && mahasiswa.kampus.tahun_lulusan) {
//                     const { prodi, kampus, tahun_lulusan } = mahasiswa.kampus;

//                     let existing = acc.find(data =>
//                         data.prodi.toString() === prodi.toString() &&
//                         data.kampus.toString() === kampus.toString() &&
//                         data.tahun_lulusan === tahun_lulusan
//                     );

//                     if (!existing) {
//                         existing = {
//                             prodi,
//                             kampus,
//                             tahun_lulusan,
//                             jenjang: mahasiswa.kampus.jenjang || "Tidak Diketahui",
//                             keselarasan: {
//                                 selaras: { jumlah: 0, persentase: "0%" },
//                                 tidak_selaras: { jumlah: 0, persentase: "0%" }
//                             }
//                         };
//                         acc.push(existing);
//                     }

//                     if (item.selaras) {
//                         existing.keselarasan.selaras.jumlah += 1;
//                     } else {
//                         existing.keselarasan.tidak_selaras.jumlah += 1;
//                     }
//                 }
//                 return acc;
//             }, []);

//             outputData.forEach(data => {
//                 const total = data.keselarasan.selaras.jumlah + data.keselarasan.tidak_selaras.jumlah;
//                 if (total > 0) {
//                     data.keselarasan.selaras.persentase = ((data.keselarasan.selaras.jumlah / total) * 100).toFixed(2) + "%";
//                     data.keselarasan.tidak_selaras.persentase = ((data.keselarasan.tidak_selaras.jumlah / total) * 100).toFixed(2) + "%";
//                 }
//             });
//         } else if (type === 'vertikal') {
//             const result = hasilKeselarasan.reduce((acc, item) => {
//                 const mahasiswa = item.id_mahasiswa;
//                 if (!mahasiswa || !mahasiswa.kampus) return acc;

//                 const { prodi, tahun_lulusan, jenjang } = mahasiswa.kampus;
//                 const key = `${prodi}-${tahun_lulusan}-${jenjang}`;

//                 let group = acc[key];
//                 if (!group) {
//                     group = {
//                         tahun_lulusan,
//                         jenjang,
//                         prodi,
//                         keselarasan: {
//                             tinggi: { jumlah: 0, persentase: '0%' },
//                             sama: { jumlah: 0, persentase: '0%' },
//                             rendah: { jumlah: 0, persentase: '0%' }
//                         }
//                     };
//                     acc[key] = group;
//                 }

//                 if (item.tinggi) group.keselarasan.tinggi.jumlah += item.tinggi;
//                 if (item.sama) group.keselarasan.sama.jumlah += item.sama;
//                 if (item.rendah) group.keselarasan.rendah.jumlah += item.rendah;

//                 return acc;
//             }, {});

//             outputData = Object.values(result).map((group) => {
//                 const total =
//                     group.keselarasan.tinggi.jumlah +
//                     group.keselarasan.sama.jumlah +
//                     group.keselarasan.rendah.jumlah;

//                 if (total > 0) {
//                     group.keselarasan.tinggi.persentase = ((group.keselarasan.tinggi.jumlah / total) * 100).toFixed(2) + '%';
//                     group.keselarasan.sama.persentase = ((group.keselarasan.sama.jumlah / total) * 100).toFixed(2) + '%';
//                     group.keselarasan.rendah.persentase = ((group.keselarasan.rendah.jumlah / total) * 100).toFixed(2) + '%';
//                 }

//                 return group;
//             });
//         }

//         const savedOutput = await (type === 'horizontal' ? OutputHorizontal : OutputVertikal).insertMany(outputData);

//         return res.status(200).json({
//             message: `Data successfully processed and saved to Output ${type === 'horizontal' ? 'Horizontal' : 'Vertikal'}`,
//             data: savedOutput
//         });
//     } catch (error) {
//         console.error('Error processing data', error.message);
//         return res.status(500).json({
//             message: 'Error processing data',
//             error: error.message
//         });
//     }
// };
