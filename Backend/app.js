const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

const app = express();

 dotenv.config({
    path: "./.env",
 })

// if case sensitive just check dbname Portfolio
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
})

db.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("MySQL connected successfully");
    }
})

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const location = path.join(__dirname, "./public")
app.use(express.static(location));

app.set("view engine", "hbs");

const partialsPath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialsPath);

app.use("/", require("./routes/pages"));
// Here it will take care of routes inside auth.js where we will use it for sending data from form to the DB
app.use("/auth", require("./routes/auth"));

// app.use( async (req, res, next) => {
//     res.locals.user = req.user;
//     console.log(req.body);
//     next();
// })

app.listen(5500, () => {
    console.log("Server started at port 5500");;
});











