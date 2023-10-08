const crypto = require('crypto');
const fs = require('fs');
const path = require("path");

class FileEncryption {
    constructor(filename) {
        this.filename = path.join(__dirname, filename)
        this.ALGO = "aes-256-cbc"
    }

    readKeysFromFile() {
        try {
            const data = fs.readFileSync(this.filename, 'utf8').trim().split('\n');

            if (data.length !== 2) {
                throw new Error('File must contain exactly two lines.');
            }

            const [enc, iv] = data.map(line => line.trim());
            return { enc, iv };
        } catch (error) {
            console.error('Error reading file:', error.message);
            return null;
        }
    }

    encrypt(text) {
        const { enc, iv } = this.readKeysFromFile();
        // console.log(enc,iv)
        if (!enc || !iv) {
            console.error('Keys not available.');
            return null;
        }

        try {
            let cipher = crypto.createCipheriv(this.ALGO, enc, iv);
            let encrypted = cipher.update(text, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error.message);
            return null;
        }
    }

    decrypt(text) {
        const { enc, iv } = this.readKeysFromFile();
        if (!enc || !iv) {
            console.error('Keys not available.');
            return null;
        }

        try {
            let decipher = crypto.createDecipheriv(this.ALGO, enc,iv);
            let decrypted = decipher.update(text, 'base64', 'utf8');
            return decrypted + decipher.final('utf8');
        } catch (error) {
            console.error('Decryption error:', error.message);
            return null;
        }
    }
}

module.exports = FileEncryption;