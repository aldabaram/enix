const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  session({
    secret: "votre_secret",
    resave: false,
    saveUninitialized: true,
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "votre_base_de_donnees",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

app.post("/connexion", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM utilisateurs WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.username = username;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.get("/enix", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/connexion.html");
  }
  res.send(`Bienvenue, ${req.session.username}! Ceci est une page protégée.`);
});

app.get("/deconnexion", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/enix");
    }
    res.clearCookie("connect.sid");
    res.redirect("/connexion.html");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
