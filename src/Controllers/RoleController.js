const Role = require('../Models/RoleModel')

exports.addRole = async (req, res) => {
    try {
        const role = req.body
        const newRole = new Role(role)
        await newRole.save()
        return res.status(200).json({
            message: "Successfully add Role",
            data : newRole
    })
    } catch (error) {
        console.log(error)
    }

}

exports.getRole = async ( req, res) => {
    try {
        const dataRole = await Role.find()
        if (!dataRole) return res.status(404).json({ messsage : "Role not Found"})
        return res.status(200).json({ message: "Succesfully get Role", data : dataRole})
    } catch (error) {
        return res.status(500).json({ messsage : "Unable get Role", error : error.message} )
    }
}

exports.getRoleUmum = async (req, res) => {
    try {
        const dataRole = await Role.find({ role: { $ne: 'Mahasiswa' } });

        if (!dataRole || dataRole.length === 0) {
            return res.status(404).json({ message: "Role not Found" });
        }

        return res.status(200).json({
            message: "Successfully get Role (excluding Mahasiswa)",
            data: dataRole,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to get Role",
            error: error.message,
        });
    }
}

exports.getRoleForAdmin = async (req, res) => {
    try {
        
        const dataRole = await Role.find({role : { $ne: 'Super Admin'}})

        if (!dataRole || dataRole.length === 0){
            console.error("Data Role not Found");
            return res.status(404).json({
                message : "Data Role not Found"
            })
        }

        return res.status(200).json({
            message : "Succesfully get Role",
            data : dataRole
        })
    } catch (error) {
        return res.status(500).json({
            message : "Unable to get role",
            error : error.message
        })
    }
}

exports.getRoleForKaprodi = async (req, res) => {
    try {

        const dataRole = await Role.find({ role: { $nin: ['Admin', 'Super Admin'] } });

        if (!dataRole || dataRole.length === 0) {
            console.error("Data Role not Found");
            return res.status(404).json({
                message: "Data Role not Found"
            });
        }

        return res.status(200).json({
            message: "Successfully retrieved roles",
            data: dataRole
        });
    } catch (error) {

        console.error("Error fetching roles:", error.message);
        return res.status(500).json({
            message: "Unable to get roles",
            error: error.message
        });
    }
};
