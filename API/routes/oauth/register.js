const router = require('express').Router();
const bcrypt = require('bcrypt');
const u = require('../../utils')


router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {

    const [rows] = await u.db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(500).json({ message: 'Error al registrar usuario el usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await u.db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    //    res.status(201).json({ message: 'Usuario creado exitosamente' });

    let token = u.jwt.generateJWT({
      username: username,
      id: (await u.db.query('SELECT id FROM users WHERE (username = ?)', [username]))[0][0].id
    })

    res.status(201).json({
      error: null,
      message: "Usuario registrado correctamente"
    })/*header('auth-token', token).json({
      error: null,
      data: { token }
    }).*/


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

module.exports = router;
