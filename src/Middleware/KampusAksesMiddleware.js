const Kampus = require('../Models/KampusModel');
const User = require('../Models/UserModel');

const checkRoleAndAccess = async (req, res, next) => {
    try {
        const { id: userId, role: userRole } = req.user; 
        const { id_kampus } = req.body;

        if (userRole === 'Admin') {
            const kampus = await Kampus.findById(id_kampus);
            if (!kampus) {
                return res.status(404).json({ message: "Kampus not found" });
            }
            if (!kampus.pengguna.includes(userId)) {
                return res.status(403).json({ message: "You are not authorized to access this kampus" });
            }
        }

        if (userRole === 'Super Admin') {
            console.log(`Super Admin (${userId}) is accessing data for all campuses.`);
        }

        next(); 

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = checkRoleAndAccess;
