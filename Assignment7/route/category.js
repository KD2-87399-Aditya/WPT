const express = require("express");
const db = require("../db");
const utils = require("../utils");
const multer = require("multer");

const app = express.Router();
const upload = multer({ dest: "images" });

app.get("/", (req, res) => {
  const statement = `select id,title,details,image from category;`;
  db.pool.query(statement, (err, result) => {
    res.send(utils.createResult(err, result));
  });
});

app.post("/", upload.single("icon"), (req, res) => {
  const { title, details } = req.body;
  console.log(req.file);
  const fileName = req.file.filename;
  const statement = `insert into category(title,details,image) values(?,?,?);`;
  db.pool.query(statement, [title, details, fileName], (err, result) => {
    res.send(utils.createResult(err, result));
  });
});

module.exports = app;
