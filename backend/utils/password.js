const securePassword = require("secure-password");

const pwd = new securePassword();


exports.hashedPassword = async(plainPassword) => {
    try {

        const hashedBuffer = await pwd.hash(Buffer.from(plainPassword));
        return hashedBuffer.toString('base64');

    } catch (e) {
        console.error(e);
        throw new Error("Password Hashing Failed");
    }
}


exports.verifyPaasword = async(storedHash, inputPasswrod) => {
    try {

        const hashedBuffer = Buffer.from(storedHash, 'base64');
        const res = await pwd.verify(Buffer.from(inputPasswrod), hashedBuffer);

        if (res === securePassword.VALID) {
            return true;
        } else if (res == securePassword.VALID_NEEDS_REHASH) {
            return true;
        } else {
            return false;
        }

    } catch (e) {
        console.error(e);
        throw new Error("Password verification is failed ");
    }
}