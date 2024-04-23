const app = require('express').Router();
const u = require('../../utils/index')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const { error } = require('winston');
app.post('/', async (req, res) => {
//  res.status(200).json({ message: 'Login correcto', jwToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTMzNTYwMDQ3NzQsImlkIjoxLCJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTMwOTY4MDR9.Hvdi9iS30DXk-GLIkfwFvA6WsJU8RMMEJZDNJZ_hZNsTOguuNpLn6ylvI5v3Vdjo7u8J_EFjj5bAKX39dfoWyEnpN3735lVqGixdQC17r-XOEQ5i67g2IX1NiFGAdr_q0vt8RyCn1wsjuXacVjuVVtfmmMnZ86-1pdZhLlEHyJk0ocv9_dn3GnCOxk02Leg8LpPUKsZPAkAqBMrxad6fTnRhtRk1QSyjrpXqMdXt26WGRuuL99e5_kpQIoQFRS8xw8KjN4qyLpoonynsA-WNNIq0dS7GkY9nuAgyF6BNpuNW5pk7V94qWypWNwgGX5T_2xVm0Aaap44rFgizx4duFw' })
  
  const { username, password } = req.body;

    try {
      const [rows] = await u.db.query('SELECT * FROM users WHERE username = ?', [username]);
      const user = rows[0];
  
      if (!user) {
        throw new Error('Nombre de usuario o contraseña incorrectos');
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        let token = await u.jwt.generateJWT(user)

        res.status(200).json({ error: null, message: 'Inicio de sesión exitoso', jwToken: token })
      } else {
        res.status(500).json({ message: 'Nombre de usuario o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = app;
