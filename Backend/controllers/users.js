const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        msg: "Please Enter your email and password",
        msg_type: "error",
      });
    }

    db.query(

      // try using the ${var name} in the query 
      `SELECT * FROM users WHERE email =?`,
      [email],
      async (error, result) => {
        console.log(result);
        if (result.length <= 0) {
          return res.status(401).render("login", {
            msg: "Email or password incorrect",
            msg_type: "error",
          });
        } else {
          if (!(await bcrypt.compare(password, result[0].pass))) {
            return res.status(401).render("login", {
              msg: "Email or password incorrect",
              msg_type: "error",
            });
          } else {
            const id = result[0].Id;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            console.log("The token is " + token);
            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            //Check cookie in networks
            // Check the token in inspect-> Application -> cookies -> localhost:5500
            res.cookie("Mahee", token, cookieOptions);
            // res.status(200).redirect("/home");
            res.status(200).redirect("/profile");

          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//here we will store to DB
exports.register = (req, res) => {
  console.log(req.body);
  // const name = req.body.name;
  // const email = req.body.email;
  // const password = req.body.password;
  // const confirm_password = req.body.confirm_password;
  // console.log(name);
  // console.log(email);
  // res.send("Form Submitted");

  const { name, email, password, confirm_password } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        confirm.log(error);
      }

      if (result.length > 0) {
        //take care of case sensitive
        return res.render("register", {
          msg: "Email already taken",
          msg_type: "error",
        });
      } else if (password !== confirm_password) {
        return res.render("register", {
          msg: "Password does not match",
          msg_type: "error",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      //   console.log(hashedPassword);
      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, pass: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
            return res.render("register", {
              msg: "Users Registerstion successful",
              msg_type: "good",
            });
          }
        }
      );
    }
  );
};

//Cookie detailed decoding
// here next is used to check if user is logged in or not and moves to next step
exports.isLoggedIn = async (req, res, next) => {
  // req.name="Check Login....";
  console.log(req.cookies);
  if (req.cookies.Mahee) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.Mahee,
        process.env.JWT_SECRET
      );
      //   console.log(decode);
      db.query(
        "SELECT * FROM users WHERE id=?",
        [decode.id],
        (err, results) => {
          console.log(results[0]);
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};

exports.logout =  (req, res) => {
  res.cookie("Mahee", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};




exports.orders = async (req, res, next) =>
{
  const user_id = req.user.Id;
    db.query(
    "SELECT * FROM orders JOIN users ON orders.USER_ID = users.Id WHERE orders.USER_ID =? AND users.Id=?",
    [user_id, user_id],
    (err, results, fields) => {
      // console.log(results);
      // console.log(fields);
      if (!results) {
        return next();
      }
      req.orders = results;
      return next();
    }
  );  
}


exports.holdings = async (req, res, next) => {
  const user_id = req.user.Id;

  db.query(
    "UPDATE holdings h JOIN (SELECT stock_symbol, AVG(Purchase_price) AS avg_price FROM orders WHERE USER_ID = ? GROUP BY stock_symbol) o ON h.stock_symbol = o.stock_symbol SET h.Avg_Cost = o.avg_price WHERE h.USER_ID = ?",
    [user_id, user_id],
    (err, results1, fields) => {
      if (err) {
        return next(err);
      }

      db.query(
        "SELECT * FROM holdings WHERE USER_ID = ?",
        [user_id],
        (err, results2, fields) => {
          if (err) {
            return next(err);
          }

          console.log(results2);
          req.holdings = results2;
          return next();
        }
      );
    }
  );
}



// exports.holdings = async (req, res, next) =>
// {
//   const user_id = req.user.Id;
//     db.query(
//     "select * from holdings JOIN users ON holdings.USER_ID = users.Id WHERE holdings.USER_ID =? AND users.Id=?",
//     [user_id, user_id],
//     (err, results, fields) => {
//       console.log(results);
//       // console.log(fields);
//       if (!results) {
//         return next();
//       }
//       req.holdings = results;
//       return next();
//     }
//   );  
// }

exports.stocks = async (req, res, next) =>
{
    db.query(
    "select * from stock",
    (err, results, fields) => {
      // console.log(results);
      // console.log(fields);
      if (!results) {
        return next();
      }
      req.stocks = results;
      return next();
    }
  );  
}

exports.account_details = async (req, res, next) =>
{
  const user_id = req.user.Id;
  db.query(
  // "SELECT * FROM ACCOUNT_DETAILS JOIN users ON ACCOUNT_DETAILS.USER_ID = users.Id WHERE ACCOUNT_DETAILS.USER_ID =? AND users.Id=?",
  "SELECT * FROM ACCOUNT_DETAILS ",
  // [user_id, user_id],
    (err, results, fields) => {
      // console.log(results);
      // console.log(fields);
      if (!results) {
        return next();
      }
      // console.log(results);
      req.account_details = results;
      // console.log(  req.account_details);
      return next();
    }
  );  
}