const BelumBekerja = require('../Models/BigData/MasterDataBelumBekerja')

exports.addBelumBekerja = async (req, res) => {
    try {
        
        const data = req.body
        if (!data) {
            console.log("Data Required");
            return res.status(400).json({ message : "Data Required"})
        }
        
        const belumBekerja = new BelumBekerja(data)
        await belumBekerja.save()

        if (!belumBekerja) {
            console.log("Failed add")
            return res.status(400).json({
                message : "Failed add",
            })
        }

        return res.status(200).json({
            message : "Succesfully add",
            data : belumBekerja
        })
    } catch (error) {
        console.error("Unable to add \n error : ", error);
        return res.status(500).json({
            message : "Unable add",
            error : error.message
        })
    }
}

exports.getBelumBekerja = async (req, res) => {
    try {
        
        const data = await BelumBekerja.find()
        if(!data || data.length === 0){
            console.log("Failed or Not Found");
            return res.status(400).json({ message : "Failed or Not Found"})
        }
        return res.status(200).json({
            message : "Succesfully get",
            data : data
        })
    } catch (error) {
        console.error("Unable to get");
        return res.status(400).json({ message : "Unable to get"})
    }
}