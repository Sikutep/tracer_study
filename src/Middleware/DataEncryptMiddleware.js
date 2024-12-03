require('dotenv').config();

const crypto = require('crypto')

const ENCRYPTION_KEY = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex')
const IV = Buffer.from(process.env.CRYPTO_IV, 'hex')



exports.encryptData = (data) => {
    const cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: IV.toString('hex') };
}

exports.decryptData = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);

}

