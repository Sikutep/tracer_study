const detailKegiatan = require('../Models/TracerStudy/Kegiatan/DetailKegiatanModel');
const Soal = require('../Models/TracerStudy/Kegiatan/SoalModel');
const Kampus = require('../Models/KampusModel');
const TracerStudy = require('../Models/TracerStudy/DataTracer/TracerStudyModel');
const AtensiModel = require('../Models/DataProcessing/KeselarasanHorizontal/AtensiModel');
const AtensiModelVertikal = require('../Models/DataProcessing/KeselarasanVertikal/AtensiModel');



exports.getTracerStudy = async (req, res) => {
    try {
        const tracer = await TracerStudy.find()
        if(!tracer) return res.status(404).json({ message: 'Data not Found'})
        
        return res.status(200).json({ message : "Succesfully get Data"})
    } catch (error) {
        return res.status(500).json({
            message : "Unable to get Data",
            error : error.message
        })
    }
}
exports.getById = async (req, res) => {
    try {
        const id = req.params.id
        const tracer= await TracerStudy.findById(id)
        if (!tracer) return res.status(404).json({ message : "Data not Found"})
        return res.status(200).json({ message : "Succesfully get Data", data : tracer})
    } catch (error) {
        return res.status(500).json({
            message : "Unable to get Data",
            error : error.message
        })
    }
}






// ================== Step 1 Tambah Detail Kegiatan ===================
exports.addDetailKegiatan = async (req, res) => {
    try {
        const { banner, nama_kegiatan, tanggal_mulai, tanggal_berakhir, latar_belakang, tujuan_kegiatan, manfaat_kegiatan } = req.body;
        const data = { nama_kegiatan, tanggal_mulai, tanggal_berakhir };
        if (!data) return res.status(400).json({ message: "Data Required" });

        const detail = new detailKegiatan(req.body);
        await detail.save();

        const tracerStudy = new TracerStudy({ id_detail: detail._id });
        await tracerStudy.save();

        return res.status(200).json({
            message: "Successfully added",
            data: {
                data_detail: detail,
                data_tracer: tracerStudy
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to add Data", error: error.message });
    }
}

// ================== Step 2 Tambah Skala Kegiatan ===================
exports.addSkalaKegiatan = async (req, res) => {
    try {
        const id_tracer = req.params.id;
        const { skala_kegiatan, tahun_lulusan, id_kampus, id_jenjang, id_prodi } = req.body;
        
        if (!skala_kegiatan || !tahun_lulusan || !id_kampus || !id_jenjang || !id_prodi) {
            return res.status(400).json({ message: "Data Required" });
        }

        const skala = await TracerStudy.findByIdAndUpdate(id_tracer, req.body, { new: true, runValidators: true });

        if (!skala) return res.status(401).json({ message: "ID Data not found or Failed" });

        return res.status(200).json({ message: "Successfully Added", data: skala });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to add Skala kegiatan", error: error.message });
    }
}

// ================== Step 3 Tambah Soal ===================
exports.addSoal = async (req, res) => {
    try {
        const id_tracer = req.params.id;
        const { soal, jawaban } = req.body;
        if (!soal || !jawaban || !id_tracer) return res.status(400).json({ message: "Data soal, jawaban, and ID required" });

        const data = new Soal(req.body);
        await data.save();

        const idSoal = await TracerStudy.findByIdAndUpdate(id_tracer, { $set: { id_soal: data._id } }, { new: true, runValidators: true });
        if (!idSoal) return res.status(401).json({ message: "ID Data not found or Failed" });

        return res.status(200).json({
            message: "Successfully added Data",
            data: {
                data_detail: data,
                data_tracer: idSoal
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable to Add", error: error.message });
    }
}


// ================== Step 3 Apply Kriteria ===================
exports.addKriteriaAtensi = async (req, res) => {
    try {
        const id_tracer = req.params.id;
        const atensiHorizontal = await AtensiModel.find()
        const idAtensiHorizontal = await TracerStudy.findByIdAndUpdate(id_tracer, { $set : { atensi_horizontal : atensiHorizontal._id }}, { new : true, runValidators: true} )
        
        const atensiVertikal = await AtensiModelVertikal.find()
        const idAtensiVertikal = await TracerStudy.findByIdAndUpdate(id_tracer,  { $set : { atensi_vertikal : atensiVertikal._id }}, { new : true, runValidators: true} )
        return res.status(200).json({
            message : "Succesfully Apply Kriteria",
            data : {
                atensi_horizontal : idAtensiHorizontal,
                atensi_vertikal : idAtensiVertikal
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Unable to Apply Kriteria"})
    }
}