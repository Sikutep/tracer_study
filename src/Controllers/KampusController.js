const Kampus = require('../Models/KampusModel')
const Prodi = require('../Models/ProdiModel')
const User = require('../Models/UserModel')


exports.getAll = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const skip = (page - 1) * limit;

        const totalKampus = await Kampus.countDocuments({not_delete: true});

        const kampus = await Kampus.find({ not_delete : true}).populate({
            path : "akreditasi",
            select : "_id akreditasi"
        })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalKampus / limit);

        return res.status(200).json({
            message: "Get all kampus successfully",
            data: kampus,
            meta: {
                currentPage: page,
                totalPages: totalPages,
                totalKampus: totalKampus,
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


exports.addKampus = async (req, res) => {
    try {
        const body = req.body
        if(!body) return res.status(404).json({
            message: "Field in kampus is required"
        })
        const kampus = new Kampus(body)
        await kampus.save()
        return res.status(200).json({
            message: "Succesfully add data",
            data : kampus
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable add kampus",
            error
        })
    }
}

exports.editKampus = async (req, res) => {
    try {
        const kampusId = req.params.id
        const { kode_pt, psdku, prodi, pengguna, akreditasi, status} = req.body

        if (!kode_pt || !psdku || !prodi || !pengguna || !akreditasi || !status){
            return res.status(400).json({
                message : "Field Required"
            })
        }

        const dataKampus = {kode_pt, psdku, prodi, pengguna, akreditasi, status}
        const updateKampus = await Kampus.findByIdAndUpdate(kampusId, dataKampus, { new : true, runValidators : true })

        if(!updateKampus) return res.status(404).json({
            message : "Failed to edit Kampus"
        })

        return res.status(200).json({
            message: "Kampus has been updated",
            data : updateKampus
        })
    
    } catch (error) {
        return res.status(500).json({
             message : "Unable to edit Kampus"
        })
    }
}

exports.deleteKampus = async (req, res) => {
    try {
        const kampusId = req.params.id
        const kampus = await Kampus.findById(kampusId)
        if(!kampus) return res.status(404).json({
            message : "Kampus not Found"
        })
        
        kampus.not_delete = false
        await kampus.save()

        return res.status(200).json({
            message: "Kampus successfully deleted",
            data: kampus
        });
    } catch (error) {
        return res.status(500).json({
            message : "Unable to delete Kampus"
        })
    }
}

