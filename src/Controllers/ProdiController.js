const Prodi = require('../Models/ProdiModel')

exports.getAll = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const skip = (page - 1) * limit;

        const totalProdi = await Prodi.countDocuments();

        const prodi = await Prodi.find()
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalProdi / limit);

        return res.status(200).json({
            message: "Get all prodi successfully",
            data: prodi,
            meta: {
                currentPage: page,
                totalPages: totalPages,
                totalProdi: totalProdi,
                pageSize: limit
            }
        });
    } catch (error) {
        console.error("Failed:", error);
        return res.status(500).json({
            message: "Failed to get data",
            error: error.message || error
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const prodiId = req.params.id
        const prodi = await Prodi.findById(prodiId)
        if(!prodi) return res.status(404).json({
            message: "Prodi is not define"
        })
        return res.status(200).json({
            message: "Succesfully get Prody",
            data : prodi
        })
    } catch (error) {
        return res.status(400).json({
            message: "Failed get Prody",
            error
        })
    }
}

exports.createProdi = async (req, res) => {
    try {
        const { kode, nama, jenjang, akreditasi, status  } = req.body
        if( !kode || !nama || !jenjang || !akreditasi || !status ){
            return res.status(400).json({
                message: "Field is required"
            })
        }
        const prodi = new Prodi(req.body)
        await prodi.save()
        return res.status(200).json({
            message:"Succesfully Save Data",
            data : prodi
        })
    } catch (error) {
        return res.status(400).json({
            message:"Failed to add Data",
            error
        })
    }
}

exports.editProdi = async (req, res) => {
    try {
        const prodiId = req.params.id
        const { kode, nama, jenjang, akreditasi, status } = req.body

        const updateData = { kode, nama, jenjang, akreditasi, status }
        const updateProdi = await Prodi.findByIdAndUpdate(prodiId, updateData, { new: true, runValidators: true })

        
        if(!updateProdi) return res.status(404).json({
            message: "Prodi not found"
        })

        return res.status(200).json({
            message: "Prodi has been Updated",
            data: updateProdi
        })
    } catch (error) {
        console.error("Error during update:", error);  
        return res.status(500).json({
            message: "Failed to update user",
            error: error.message || error
        });
    }
}

exports.deleteProdi = async (req, res) => {
    try {
        const prodiId = req.params.id
        const prodi = await Prodi.findById(prodiId)
        if(!prodi) return res.status(404).json({
            message : "Prodi not Found"
        })
        
        prodi.not_delete = false
        await prodi.save()

        return res.status(200).json({
            message: "Prodi successfully deleted",
            data: prodi
        });
    } catch (error) {
        return res.status(500).json({
            message : "Unable to delete prodi"
        })
    }
}