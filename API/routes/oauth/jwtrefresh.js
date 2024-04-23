const app = require('express').Router();
const u = require('../../utils/index')
const { jwtDecode } = require('jwt-decode')
app.post('/', async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let verify = await u.jwt.verifyJwt(token)

        if (verify) {
            if (Date.now() > jwtDecode(token).exp + 1000 * 3600 * 168) //If is expired more than 7 days return to login
                return res.status(401).json({ message: 'Expired Token more than 7 days' });

            const [rows] = await u.db.query('SELECT * FROM users WHERE username = ?', [jwtDecode(token).name]);
            let newToken = await u.jwt.generateJWT(rows[0])

            res.status(200).json({ error: null, message: 'New token regenerated', jwToken: newToken })
        } else {
            return res.status(403).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header required' });
    }
});

module.exports = app;