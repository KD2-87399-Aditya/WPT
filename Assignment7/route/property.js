const express = require("express");
const db = require("../db");
const utils = require("../utils");

const app = express.Router();

app.post("/", (req, res) => {
  const {
    categoryId,
    title,
    details,
    address,
    contactNo,
    ownerName,
    isLakeView,
    isTV,
    isAC,
    isWifi,
    isMiniBar,
    isBreakfast,
    isParking,
    guests,
    bedrooms,
    beds,
    bathrooms,
    rent,
    profileImage,
  } = req.body;
  const st = `insert into property(categoryId,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent,profileImage) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  db.pool.query(
    st,
    [
      categoryId,
      title,
      details,
      address,
      contactNo,
      ownerName,
      isLakeView,
      isTV,
      isAC,
      isWifi,
      isMiniBar,
      isBreakfast,
      isParking,
      guests,
      bedrooms,
      beds,
      bathrooms,
      rent,
      profileImage,
    ],
    (err, result) => {
      res.send(utils.createResult(err, result));
    }
  );
});

app.get("/", (req, res) => {
  const st = `SELECT id,title,details,rent FROM property;`;
  db.pool.query(st, (err, result) => {
    res.send(utils.createResult(err, result));
  });
});

module.exports = app;
