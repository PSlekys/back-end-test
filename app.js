const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

app.use(bp.json());
app.use(cors());

const con = mysql.createConnection({
  host: "194.135.87.110",
  user: "slscom_testing",
  password: "csrKEHRK2YAG27tz",
  database: "slscom_testing",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server");
});

function checkNumberplates(plate) {
  const array = [
    plate[0].toLowerCase() !== plate[0].toUpperCase(),
    plate[1].toLowerCase() !== plate[1].toUpperCase(),
    plate[2].toLowerCase() !== plate[2].toUpperCase(),
    plate[3].toLowerCase() === plate[3].toUpperCase(),
    plate[4].toLowerCase() === plate[4].toUpperCase(),
    plate[5].toLowerCase() === plate[5].toUpperCase(),
  ];

  return array.every((x) => x);
}

function validateInput(data) {
  return (
    data.name.length >= 1 &&
    data.name.length <= 255 &&
    data.surname.length >= 1 &&
    data.surname.length <= 255 &&
    Number.isInteger(data.age) &&
    data.numberplates.length >= 1 &&
    data.numberplates.length <= 6 &&
    typeof data.student === "boolean"
  );
}

app.get("/", (req, res) => {
  con.query(`SELECT * FROM people`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("NOT OK");
    } else {
      res.json(result);
    }
  });
});

app.get("/person/:id", (req, res) => {
  const id = req.params.id;
  con.query(`SELECT * FROM people WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("NOT OK");
    } else {
      res.json(result);
    }
  });
});

app.post("/", (req, res) => {
  const data = req.body;

  if (validateInput(data)) {
    con.query(
      `INSERT INTO people (name, surname, age, student, numberplates)
        VALUES ('${data.name}','${data.surname}','${data.age}','${
        data.student ? 1 : 0
      }','${data.numberplates}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send("NOT OK");
        } else {
          res.send("OK");
        }
      }
    );
  } else {
    res.status(400).send("NOT OK");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("The server is running at port: " + port));
