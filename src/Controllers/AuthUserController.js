// const User = require('../Models/UserModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// // JWT Secret and Expiration
// // const JWT_SECRET = 'your_jwt_secret';
// // const JWT_EXPIRES_IN = '1h';

// // Login Function
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Incorrect password" });
//         }

//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
//         return res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         console.error("Login failed:", error);
//         return res.status(500).json({ message: "An error occurred", error: error.message });
//     }
// };


// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Generate a reset token
//         const resetToken = crypto.randomBytes(32).toString('hex');
//         user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//         user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
//         await user.save();

        
//         const transporter = nodemailer.createTransport({
//             service: 'Gmail', // or your preferred email service
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_email_password',
//             },
//         });

//         const mailOptions = {
//             from: 'no-reply@yourapp.com',
//             to: user.email,
//             subject: 'Password Reset',
//             text: `You requested a password reset. Use the following token: ${resetToken}`
//         };

//         await transporter.sendMail(mailOptions);
//         return res.status(200).json({ message: "Password reset link sent" });
//     } catch (error) {
//         console.error("Forgot password error:", error);
//         return res.status(500).json({ message: "An error occurred", error: error.message });
//     }
// };



const User = require('../Models/UserModel');
const nodemailer = require('nodemailer');


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email or password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        return res.status(200).json({ message: "Login Seccesfully", user });
    } catch (error) {
        console.error("Gagal login:", error);
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        // Buat reset token sederhana
        const resetToken = Math.random().toString(36).substr(2);

        // Kirim link reset melalui email (tanpa penyimpanan token)
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // sesuaikan dengan penyedia layanan email Anda
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password',
            },
        });

        const mailOptions = {
            from: 'no-reply@yourapp.com',
            to: user.email,
            subject: 'Reset Password',
            text: `Anda telah meminta reset password. Gunakan token berikut untuk reset password Anda: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Link reset password telah dikirim" });
    } catch (error) {
        console.error("Error forgot password:", error);
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};
