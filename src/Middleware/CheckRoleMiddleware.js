require('dotenv').config();

const Role = require('../Models/RoleModel');
const Kampus = require('../Models/KampusModel');

exports.combinedRoleCheck = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { role: userRole } = req.user;

            console.log("Allowed Roles:", allowedRoles); 
            console.log("User Role from Request:", userRole); 
            const rolesData = await Role.findById(userRole);
            console.log("Role Data from Database:", rolesData); 

            if (!rolesData) {
                return res.status(403).json({ message: "Role not found in database" });
            }

            if (!allowedRoles.includes(rolesData.role)) {
                return res.status(403).json({ message: "Access denied, insufficient permissions" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    };
};



exports.checkMahasiswaRole = async (req, res, next) => {
    try {
        const { role: userRole } = req.user;

        console.log("User Role from Request:", userRole);

        const rolesData = await Role.findById(userRole._id);
        console.log("Role Data from Database:", rolesData);

        if (!rolesData) {
            return res.status(403).json({ message: "Role not found in database" });
        }

        if (rolesData.role.toLowerCase() !== "mahasiswa") {
            return res.status(403).json({ message: "Access denied, only Mahasiswa can access this resource" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




exports.combinedRoleCheckV2 = (allowedRoles = [], validateEntity = false) => {
    return async (req, res, next) => {
        try {
            const { id: userId, role: userRole } = req.user; 
            const { id_kampus } = req.body; 

          
            const rolesData = await Role.findOne({ role: userRole });
            if (!rolesData) {
                return res.status(403).json({ message: "Invalid role in storage" });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Access Denied, insufficient permissions" });
            }


            if (validateEntity && userRole === 'Admin') {
                const kampus = await Kampus.findById(id_kampus ,{ not_delete: true }).populate({
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

                if (!kampus) {
                    return res.status(404).json({ message: "Kampus not found" });
                }

                if (!kampus.pengguna.includes(userId)) {
                    return res.status(403).json({ message: "You are not authorized to access this kampus" });
                }
            }

            if (userRole === 'Super Admin') {
                console.log(`Super Admin (${userId}) is accessing data.`);
            }

            next(); 
        } catch (error) {
            console.error("Error in role or access validation:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    };
};



// router.get(
//     '/admin/dashboard',
//     authenticateToken,
//     checkRoleAndAccess(['Admin', 'Super Admin']), // Hanya validasi peran
//     dashboardController
// );

// router.post(
//     '/kampus/data',
//     authenticateToken,
//     checkRoleAndAccess(['Admin'], true), // Validasi peran dan entitas
//     kampusDataController
// );

