const AtensiModel = require('../Models/DataProcessing/KeselarasanHorizontal/AtensiModel')

exports.addAtensiHorizotal = async (req, res) => {
    try {
        const data = req.body
        if (!data) return res.status(400).json({ Message: "Data Required" })
        
        const atensiData = new AtensiModel(data)
        await atensiData.save()

        return res.status(200).json({
            message : "Succesfully add Data",
            data : atensiData
        })
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Message: "Unable to add Atensi", error : error.message })
    }
}

exports.getAtensiHorizontal = async (req, res) => {
    try {
        const data = await AtensiModel.find()
        if (!data) return res.status(404).json({ message : "Data not Found"})

        return res.status(200).json({
            message : "Succesfully get Data",
            data : data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Message: "Unable to add Atensi", error : error.message })
    }
}