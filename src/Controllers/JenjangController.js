const Jenjang = require('../Models/JenjangModel')

exports.addJenjang = async (req, res) => {
    try {
        const data = req.body
        if(!data) return res.status(404).json({
            message : "jenjang required"
        })

        const jenjang = new Jenjang(data)
        await jenjang.save()

        return res.status(200).json({
            message: "Succesfully added",
            data : jenjang
        })
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add data",
            error : error
        })
    }
}

exports.getJenjang = async (req, res) => {
    try {
        const dataJenjang = await Jenjang.find()
        if(!dataJenjang) return res.status(404).json({ message : "jenjang not Found"})
        return res.status(200).json({ message : "Succesfully get", data : dataJenjang})
    } catch (error) {
        return res.status(500).json({ message : "Unable to get"})
    }
}