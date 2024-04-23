const jwt = require('jsonwebtoken'),
    fs = require('fs'),
    path = require('path');
const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.pem"), "utf8")
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8")

module.exports = {
    async generateJWT(user) {
        const token = jwt.sign({
            exp: Date.now() + 1000 * 3600 * 72, //expire time 24h
            user_id: user.id,
            username: user.username,
        }, privateKey, { algorithm: 'RS256' })
        return token
    },
    async verifyJwt(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}