const Prodi = require('../Models/ProdiModel')
const Akreditasi = require('../Models/Akreditasimodel')

exports.getAll = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const skip = (page - 1) * limit;

        const totalProdi = await Prodi.countDocuments();

        const prodi = await Prodi.find().populate('akreditasi').populate({
            select : 'jenjang',
            path : '_id jenjang'
        })
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
        const prodi = await Prodi.findById(prodiId).populate('akreditasi').populate('jenjang')
        if(!prodi) {
            console.log("Prodi is not define");
            return res.status(404).json({
                message: "Prodi is not define"
            })
        }
        console.log('Succesfully get Prody');
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
            console.log("Field is required");
            return res.status(400).json({
                message: "Field is required"
            })
        }
        const prodi = new Prodi(req.body)
        await prodi.save()
        console.log("Succesfully Save Data");
        
        return res.status(201).json({
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
        const data = req.body

        const updateData = data

        if(!updateData){
            console.log("Prodi not found");
            return res.status(404).json({
                message: "Prodi not found"
            })  
        } 
        const updateProdi = await Prodi.findByIdAndUpdate(prodiId, updateData, { new: true, runValidators: true })

        
        console.log( "Prodi has been Updated");
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
        if(!prodi){
            console.log("Prodi not Found");
            return res.status(404).json({
                message : "Prodi not Found"
            })
        } 
        
        prodi.not_delete = false
        await prodi.save()
        console.log("Prodi successfully deleted");
        return res.status(200).json({
            message: "Prodi successfully deleted",
            data: prodi
        });
    } catch (error) {
        console.log("Unable to delete prodi", error);
        return res.status(500).json({
            message : "Unable to delete prodi"
        })
    }
}


//=================================================

exports.addAkreditasi = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(400).json({
            message : "Akreditasi Required"
        })

        const akreditasi = new Akreditasi(data)
        await akreditasi.save()
        return res.status(201).json({
            message : "SuccesFully",
            data : akreditasi
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable to add",
        })
    }
}

exports.getAkreditasi = async (req, res) => {
   try {
        const akreditasi = await Akreditasi.find()
        if(!akreditasi) return res.status(404).json({ message : "Dat not found"})
        return res.status(200).json({ message : "SuccesFully Get", data : akreditasi})
   } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Unable get Data"})
        
   }
}