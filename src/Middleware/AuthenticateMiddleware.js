require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION} = process.env;

const User = require('../Models/UserModel');
const MahasiswaModel = require('../Models/MahasiswaModel');

// exports.hashPassword = async (req, res, next) => {
//     if (req.body.akun && req.body.akun.password) {
//         req.body.akun.password = await bcrypt.hash(req.body.akun.password, 10)
//     }
//     next(); //For Editted 
// };


exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        const user = await User.findById(decoded.id).populate('roleId');
        console.log(user);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = {
            id: user._id,
            nama: user.nama,
            role: user.roleId._id, 
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Authentication Error', error : error.message });
    }
};


exports.authenticateTokenMahasiswa = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        
    
        const user = await MahasiswaModel.findById(decoded.id).populate('akun.role_id');
        console.log("Found User:", user);

    
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    
        req.user = {
            id: user._id,
            nim: user.pribadi.nim,
            nama: user.pribadi.nama,
            email: user.akun.email,
            role: user.akun.role_id, 
        };
    
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(403).json({ message: 'Authenticate Error', error : error.message });
    }
    
};


let refreshTokens = []; // Sementara Menggunakan ARRAY. Lanjutnya simpan ke DATABASE
console.log(refreshTokens);


exports.refreshTokenHandler = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: "Authorization header is missing" });
    }

    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token is missing" });
    }

    if (!refreshTokens.includes(refreshToken)) {
        console.log("Refresh token not found or invalid");
        return res.status(403).json({ message: "Refresh token not found or invalid" });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid refresh token");
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
            { 
                id: user.id,
                nama: user.nama,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_ACCESS_EXPIRATION }
        );

        return res.status(200).json({
            message: "New access token generated",
            accessToken,
        });
    });
};


// exports.refreshTokenHandler = (req, res, next) => {
//     const refreshToken = req.body.refreshToken;

//     if (!refreshToken || !refreshTokens.includes(refreshToken)) {
//         console.log("Refresh token not found or invalid" );
        
//         return res.status(403).json({ message: "Refresh token not found or invalid" });
//     }

//     jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
//         if (err) {
//             console.log("Invalid refresh token");
//             return res.status(403).json({ message: "Invalid refresh token" });
//         }

//         const accessToken = jwt.sign(
//             { 
//                 id: user.id,
//                 role : user.role
            
//             },
//             JWT_SECRET,
//             { expiresIn: JWT_ACCESS_EXPIRATION }
//         );

//         return res.status(200).json({
//             message: "New access token generated",
//             accessToken,
           
//         });
//     });
// };


exports.generateTokens = (user) => {
    const accessToken = jwt.sign(
        { 
            id: user.id,
            role : user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_EXPIRATION }
    );

    const refreshToken = jwt.sign(
        { 
            id: user.id,
            role : user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRATION }
    );


    refreshTokens.push(refreshToken);

    return { accessToken, refreshToken };
};

exports.generateTokensMahasiswa = (user) => {
    const accessToken = jwt.sign(
        { 
            id: user._id,
            nim: user.pribadi.nim,
            nama: user.pribadi.nama,
            email: user.akun.email,
            role: user.akun.role_id, 
        },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }) 
    
    const refreshToken = jwt.sign(
        { 
            id: user._id,
            nim: user.pribadi.nim,
            nama: user.pribadi.nama,
            email: user.akun.email,
            role: user.akun.role_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
    );
    


    refreshTokens.push(refreshToken);

    return { accessToken, refreshToken };
};

// Logout atau Hapus Refresh Token
exports.revokeToken = (req, res) => {
    const { refreshToken } = req.body;

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    return res.status(200).json({ message: "Refresh token revoked" });
};

