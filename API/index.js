const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middlewares/verifyToken');

//require('./utils').testDBConnection();

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
const cors = require('cors');
app.use(cors({
  origin: 'http://panel.ejemplo.com', // Cambia esto por la URL de tu frontend React en panel.ejemplo.com
  credentials: true // Habilita el intercambio de cookies entre dominios
}));
*/

app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.get('/api', verifyToken, async (req, res) => {
  res.status(200).json({ message: 'API WORKING' })

});




app.use("/api/oauth/login", require("./routes/oauth/login"));//OUT JWT
app.use("/api/oauth/register", require("./routes/oauth/register"));//OUT JWT
app.use("/api/oauth/jwtrefresh", require("./routes/oauth/jwtrefresh"));//with JWT


app.listen(PORT, () => {
  require('./utils').lg.log('API', `Server running at http://localhost:${PORT}`);
});
