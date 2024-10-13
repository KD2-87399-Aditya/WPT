const express = require("express");
const db = require("../db");
const utils = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto-js");

const app = express.Router();

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const stmt = `SELECT id,firstName,lastName FROM user WHERE email=? and password=?`;
  const encryptedPassword = String(crypto.SHA256(password));
  db.pool.query(stmt, [email, encryptedPassword], (err, users) => {
    if (err) {
      res.send(utils.createErrorResult(err));
    } else {
      if (users.length == 0) {
        res.send(utils.createErrorResult("User does not exit.."));
      } else {
        const user = users[0];
        if (user.isDeleted) {
          res.send(utils.createErrorResult("Your account is closed"));
        } else {
          const payload = { id: user.id };
          const token = jwt.sign(payload, config.secret);
          const userData = {
            token,
            name: `${user["firstName"]} ${user["lastName"]}`,
          };
          res.send(utils.createSuccessResult(userData));
        }
      }
    }
  });
});

app.post("/register", (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  const encrptedPassword = String(crypto.SHA256(password));
  const st = `insert into user(firstName,lastName,email,password,phoneNumber) values(?,?,?,?,?);`;
  db.pool.query(
    st,
    [firstName, lastName, email, encrptedPassword, phoneNumber],
    (err, result) => {
      res.send(utils.createResult(err, result));
    }
  );
});

app.put("/profile/", (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const statement = `update user set firstName= ?,LastName= ?, phoneNumber=? where id=?`;
  db.pool.query(
    statement,
    [firstName, lastName, phone, req.userId],
    (err, result) => {
      res.send(utils.createResult(err, result));
    }
  );
});

app.get("/profile/", (req, res) => {
  const statement = `select firstName,lastName,phoneNumber,email from user where id=?`;
  db.pool.query(statement, [req.userId], (err, result) => {
    res.send(utils.createResult(err, result));
  });
});

module.exports = app;
