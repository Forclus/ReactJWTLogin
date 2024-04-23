const { jwtDecode } = require('jwt-decode');
const u = require('../utils/index')
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let verify = await u.jwt.verifyJwt(token)

        if (verify) {
            if (Date.now() > jwtDecode(token).exp) //IT never could be active because in frontend is refreshtoken function
                return res.status(401).json({ message: 'Expired Token' });
            next()
        } else {
            return res.status(401).json({ message: 'Invalid Token' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header required' });
    }

};

module.exports = verifyToken;