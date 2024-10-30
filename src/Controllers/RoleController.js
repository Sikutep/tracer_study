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