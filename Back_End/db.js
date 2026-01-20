const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',       // keep empty if using XAMPP
  database: 'todo_app'
});

module.exports = db.promise();
