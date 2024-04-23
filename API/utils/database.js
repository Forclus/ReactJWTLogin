const Logger = require('./logger');
const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: 'localhost',
  user: 'test',
  password: 'test123',
  database: 'cofradias',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();
    connection.release(); // Libera la conexión
    Logger.log('Database', 'Test connection  successfully')
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
}


module.exports = { db, testDatabaseConnection };
