const User = require('../Models/UserModel');
const Role = require('../Models/RoleModel');


exports.getAll = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({ not_delete: true });

        const users = await User.find({ not_delete: true })
            .skip(skip)
            .limit(limit)
            .populate("roleId", "name");

        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            message: "Get all users successfully",
            data: users,
            meta: {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalUsers,
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

exports.searchUser = async (req, res) => {
    try {
        const { nama, email, jabatan, pendidikan } = req.query;

        const searchCriteria = {};
        if (nama) searchCriteria.nama = { $regex: nama, $options: "i" };
        if (email) searchCriteria.email = { $regex: email, $options: "i" };
        if (jabatan) searchCriteria.jabatan = { $regex: jabatan, $options: "i" };
        if (pendidikan) searchCriteria.pendidikan = { $regex: pendidikan, $options: "i" };

        const users = await User.find({ ...searchCriteria, not_delete: true }).populate("roleId", "name");

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found matching the criteria" });
        }

        return res.status(200).json({
            message: "Users found successfully",
            data: users
        });
    } catch (error) {
        console.error("Search failed:", error);
        return res.status(500).json({
            message: "Failed to search for users",
            error: error.message || error
        });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { nama, nip, jabatan, pendidikan, email, password, is_active, roleId } = req.body;
    
        if (!nama || !nip || !jabatan || !pendidikan || !email || !password || !roleId) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = new User(req.body);
        await user.save();
        return res.status(201).json({
            message: "User successfully added",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to add user",
            error: error.message || error
        });
    }
};


exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { nama, nip, jabatan, pendidikan, tentang, email, password, is_active, roleId } = req.body;

        const updateData = { nama, nip, jabatan, pendidikan, tentang, email, password, is_active, roleId };
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User successfully updated",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error during update:", error);  
        return res.status(500).json({
            message: "Failed to update user",
            error: error.message || error
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Usesr.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.not_delete = false;
        await user.save();

        return res.status(200).json({
            message: "User successfully deleted",
            data: user
        });
    } catch (error) {
        console.error("Error during delete:", error);
        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message || error
        });
    }
};
