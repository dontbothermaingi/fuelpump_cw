const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "deno",
  password: "mypassword",
  database: "coursework_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

module.exports = db;
