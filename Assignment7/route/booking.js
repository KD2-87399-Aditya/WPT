const express = require("express");
const db = require("../db");
const utils = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto-js");

const app = express.Router();

app.get("/", (req, res) => {
  const statement = "Select * from bookings";
  db.pool.query(statement, (err, result) => {
    res.send(utils.createResult(err, result));
  });
});

app.post("/", (req, res) => {
  const { propertyId, total, fromDate, toDate } = req.body;

  const statement =
    "insert into bookings(userId,propertyId,total,fromDate,toDate) values(?,?,?,?,?)";

  db.pool.query(
    statement,
    [req.userId, propertyId, total, fromDate, toDate],
    (err, result) => {
      res.send(utils.createResult(err, result));
    }
  );
});

module.exports = app;
