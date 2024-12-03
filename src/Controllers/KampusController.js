const Kampus = require('../Models/KampusModel')
const Prodi = require('../Models/ProdiModel')
const User = require('../Models/UserModel')

const formatTanggal = (tanggal) => {
    if (!tanggal) return "";
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(tanggal));
};

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalKampus = await Kampus.countDocuments({ not_delete: true });
        const kampus = await Kampus.find({ not_delete: true }).populate({
            path: "akreditasi",
            select: "_id akreditasi"
        }).populate({
            path: "prodi",
            populate: {
                path: "jenjang",
                select: "_id jenjang" 
            }
        })
            .skip(skip)
            .limit(limit);

        
        const formattedKampus = kampus.map(item => ({
            ...item._doc,
            tanggal_berdiri: formatTanggal(item.tanggal_berdiri)
        }));

        const totalPages = Math.ceil(totalKampus / limit);

        return res.status(200).json({
            message: "Get all kampus successfully",
            data: formattedKampus,
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


exports.getByIdKampus = async (req, res) => {
    try {
        const kampusId = req.params.id;
        const kampus = await Kampus.findById(kampusId)
        .populate('akreditasi')
        .populate('pengguna')
        .populate('prodi')

        if (!kampus) return res.status(404).json({ message: "Kampus not found" });


        const formattedKampus = {
            ...kampus._doc, 
            tanggal_berdiri: formatTanggal(kampus.tanggal_berdiri) 
        };

        return res.status(200).json({
            message: "Succesfully Get Kampus",
            data: formattedKampus
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unable get kampus", error: error.message });
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
            error : error.message
        })
    }
}

exports.editKampus = async (req, res) => {
    try {
        const kampusId = req.params.id
        const data = req.body

        if (!data){
            return res.status(400).json({
                message : "Field Required"
            })
        }

        const dataKampus = data
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

