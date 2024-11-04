const Kondisi = require('../Models/BigData/KondisiModel')
const Mahasiswa = require('../Models/MahasiswaModel')
const MahasiswaKondisi = require('../Models/BigData/MahasiswakondisiModel')
const Kampus = require('../Models/KampusModel')

const BidangWirausaha = require('../Models/BigData/Wirausaha/BidangUsahaModel');
const KategoriPekerjaan = require('../Models/BigData/Bekerja/KategoriPekerjaanmodel');
const JenisPekerjaan = require('../Models/BigData/Bekerja/JenisPekerjaanModel');
const Prodi = require('../Models/ProdiModel')

const hasilKeselarasanHorizontal = require('../Models/DataProcessing/KeselarasanHorizontal/HasilKeselarasanHorizontalModel')


exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalMahasiswa = await Mahasiswa.countDocuments({ not_delete: true });
        const mahasiswaList = await Mahasiswa.find({ not_delete: true })
            .skip(skip)
            .limit(limit)
            .populate("kampus.prodi", "prodi")
            .populate("kampus.kampus", "kampus")
            .populate("kondisi");

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

// GET Mahasiswa by ID
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

// SEARCH Mahasiswa with not_delete = true
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
        const { pribadi, akun, kampus, kondisi } = req.body;
        
        if (!pribadi || !akun || !kampus) {
            return res.status(400).json({
                message: "Required fields are missing (pribadi, akun, kampus)"
            });
        }

        const mahasiswa = new Mahasiswa({
            pribadi,
            akun,
            kampus,
            kondisi
        });

        await mahasiswa.save();

        return res.status(201).json({
            message: "Mahasiswa successfully added",
            data: mahasiswa
        });
    } catch (error) {
        console.error("Failed to add Mahasiswa:", error);
        return res.status(500).json({
            message: "Failed to add data",
            error: error.message || error
        });
    }
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
            return res.status(400).json({ message: "Nim or password required" });
        }

        const user = await Mahasiswa.findOne({ nim });
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.status(200).json({ message: "Login Seccesfully", user });
    } catch (error) {
        console.error("Gagal login:", error);
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

//================ Kondisi =============================
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

exports.addmahasiswaKondisi = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({
                message: "Data required"
            });
        }

        const kondisiMahasiswa = new MahasiswaKondisi(data);
        await kondisiMahasiswa.save();

        if(!kondisiMahasiswa){
            return res.status(400).json({ message : "Failed to add Kondisi Mahasiswa" })
        } else {
            const mahasiswaKondisi = await MahasiswaKondisi.findById(kondisiMahasiswa._id).populate('id_mahasiswa');
            const prodiPekerjaan = await Prodi.find().populate('kondisi');

            const { pekerjaan, wirausaha } = mahasiswaKondisi;
            const kondisi = prodiPekerjaan.find(prodi =>
                prodi._id.equals(mahasiswaKondisi.id_mahasiswa.kampus.prodi)
            )?.kondisi;

            const pekerjaanSelaras = pekerjaan && kondisi?.bekerja &&
                pekerjaan.bidang && pekerjaan.bidang.equals(kondisi.bekerja.id_bidang) &&
                pekerjaan.kategori && pekerjaan.kategori.equals(kondisi.bekerja.id_kategori) &&
                pekerjaan.jenis && pekerjaan.jenis.equals(kondisi.bekerja.id_jenis);

            const wirausahaSelaras = wirausaha && kondisi?.wiraswasta &&
                wirausaha.bidang && wirausaha.bidang.equals(kondisi.wiraswasta.id_bidang) &&
                wirausaha.kategori && wirausaha.kategori.equals(kondisi.wiraswasta.id_kategori) &&
                wirausaha.jenis && wirausaha.jenis.equals(kondisi.wiraswasta.id_jenis);

                const selaras = Boolean(pekerjaanSelaras || wirausahaSelaras);

            let keselarasan = await hasilKeselarasanHorizontal.findOne({ id_mahasiswa: mahasiswaKondisi.id_mahasiswa._id });

            if (keselarasan) {
                keselarasan.selaras = selaras;
                keselarasan.tanggal_diperbarui = new Date();
                await keselarasan.save();
            } else {
                keselarasan = new hasilKeselarasanHorizontal({
                    id_mahasiswa: mahasiswaKondisi.id_mahasiswa._id,
                    // prodi: mahasiswa.kampus.prodi.name,
                    selaras,
                    tanggal_diperbarui: new Date()
                });
                await keselarasan.save();
                console.log(keselarasan)
            }
        }
        return res.status(200).json({
            message: "Successfully added",
            data: kondisiMahasiswa
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to add data",
            error: error.message
        });
    }
};
