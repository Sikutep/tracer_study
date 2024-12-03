const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {generateTokens} = require('../Middleware/AuthenticateMiddleware')



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password harus diisi" });
        }

        const user = await User.findOne({ email }).populate('roleId');;
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        return res.status(200).json({
           
            message: "Succesfully Login",
            token: {
                accessToken,
                refreshToken,
            },
            user: {
                id: user._id,
                nip: user.nip,
                nama: user.nama,
                email: user.email,
                role: user.roleId._id, 
            },
        });

    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ message: "Unable Login", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.is_active) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'trianapahmi@gmail.com', 
                pass: 'witz ksnh pdku vokl',
            },
        });

        const mailOptions = {
            from: 'no-reply@tracer_study.com',
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Use the following token: ${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Password reset token sent to email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


exports.verifyResetToken = async (req, res) => {
    try {
        const { resetToken } = req.params;

        if (!resetToken) {
            return res.status(400).json({ message: "Token is required" });
        }

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await Pengguna.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        return res.status(200).json({
            message: "Token is valid",
            userId: user._id,
        });
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ message: "User ID and new password are required" });
        }

        const user = await User.findById(userId, {not_delete : true});
        if (!user || !user.is_active) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password has been successfully reset" });
    } catch (error) {
        console.error("Password reset failed:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const resetToken = crypto.randomBytes(32).toString('hex');
//         user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//         user.passwordResetExpires = Date.now() + 10000; 
//         await user.save();

        
//         const transporter = nodemailer.createTransport({
//             service: 'Gmail', 
//             auth: {
//                 user: 'your_email@gmail.com', 
//                 pass: 'witz ksnh pdku vokl'
//             },
//         });

//         const mailOptions = {
//             from: 'no-reply@tracerstudy.com',
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

// exports.verifyResetToken = async (req, res) => {
//     try {
//         const { resetToken } = req.params;

//         if (!resetToken) {
//             return res.status(400).json({ message: "Token is required" });
//         }

//         const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//         const user = await User.findOne({
//             passwordResetToken: hashedToken,
//             passwordResetExpires: { $gt: Date.now() },
//         });

//         if (!user) {
//             return res.status(400).json({ message: "Invalid or expired token" });
//         }

//         return res.status(200).json({ 
//             message: "Token is valid. Redirect to reset password page.", 
//             userId: user._id 
//         });
//     } catch (error) {
//         console.error("Token verification failed:", error);
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// exports.resetPassword = async (req, res) => {
//     try {
//         const { userId, newPassword } = req.body;

//         if (!userId || !newPassword) {
//             return res.status(400).json({ message: "User ID and new password are required" });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         user.password = hashedPassword;
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save();

//         return res.status(200).json({ message: "Password has been successfully reset" });
//     } catch (error) {
//         console.error("Password reset failed:", error);
//         return res.status(500).json({ message: "Server error", error: error.message });
//     }
// };



// const User = require('../Models/UserModel');
// const nodemailer = require('nodemailer');


// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Email or password required" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not Found" });
//         }

//         if (user.password !== password) {
//             return res.status(401).json({ message: "Incorrect password" });
//         }

//         return res.status(200).json({ message: "Login Seccesfully", user });
//     } catch (error) {
//         console.error("Gagal login:", error);
//         return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
//     }
// };


// exports.forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "Pengguna tidak ditemukan" });
//         }

//         const resetToken = Math.random().toString(36).substr(2);

//         const transporter = nodemailer.createTransport({
//             service: 'Gmail', 
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_email_password',
//             },
//         });

//         const mailOptions = {
//             from: 'no-reply@yourapp.com',
//             to: user.email,
//             subject: 'Reset Password',
//             text: `Anda telah meminta reset password. Gunakan token berikut untuk reset password Anda: ${resetToken}`
//         };

//         await transporter.sendMail(mailOptions);
//         return res.status(200).json({ message: "Link reset password telah dikirim" });
//     } catch (error) {
//         console.error("Error forgot password:", error);
//         return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
//     }
// };
