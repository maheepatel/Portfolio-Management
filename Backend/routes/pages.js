const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const db = require("../database");

// const https = require('https');

//runs for both / and /login
// router.get(["/", "/login"], (req, res) => {      //changing here from "/ to "/login"
//     // res.send("<h1>Hello Mahee!</h1>")
//     res.render("login");
// });

router.get("/login", (req, res) => {      //changing here from "/ to "/login"
    // res.send("<h1>Hello Mahee!</h1>")
    const user = req.user;
    res.render("login",{user});
});


router.get("/register",(req, res) => {
    res.render("register");
});

// MAIN HOME PAGE ROUTE CODE
// changed here from "/home" to "/"
// router.get("/", userController.isLoggedIn,(req, res) => {


    // console.log(req.name);
    //if we try to access home page directly then we are redirected to /login pg
    // if(req.user) {
    //     res.render("home", {user: req.user});

    // } else {
    //     res.redirect("/login");
    // }

router.get("/", userController.isLoggedIn,(req, res) => {

        res.render("home");  
});




// router.get("/orders", userController.isLoggedIn,(req, res) => {
//     if(req.user) {
//         res.render("orders", {user: req.user});
//     } else {
//         res.redirect("/login");
//     }
// });


router.post("/orders",userController.isLoggedIn, (req, res) => {

  if(req.user) {
  const { stock_symbol, order_type, purchase_price, shares } = req.body;
  
  // id of the user who is logged in
  const user_id = req.user.Id;


  
  //TO store data in DB
  db.query(
    "INSERT INTO ORDERS SET ?",
    {
      USER_ID: user_id,
      STOCK_SYMBOL: stock_symbol,
      ORDER_TYPE: order_type,
      PURCHASE_PRICE: purchase_price,
      SHARES: shares,
    },
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        // return res.status(200).send({ message: "Data stored in DB" });
        res.redirect("/orders");
      }
    }
    );
} else {
    res.redirect("/login");
}
 
  });
  
  router.get("/profile", userController.isLoggedIn, userController.account_details , async (req, res) => {
    if(req.user) {
        res.render("profile",{account_detail: req.account_details , user: req.user});
        console.log(req.account_details);
    } else {
        res.redirect("/login");
    }
});

// Route to handle adding new account details
// router.post('/add-account-details', userController.isLoggedIn, (req, res) => {
//   const { field1, field2, field3 } = req.body; // Assuming there are 3 fields to add

//   const user_id = req.user.Id;
//   // Insert the new values into the database
//   db.query(
//     'INSERT INTO ACCOUNT_DETAILS (USER_ID, field1, field2, field3) VALUES (?, ?, ?, ?)',
//     [req.user.Id, field1, field2, field3],
//     (err, results) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error adding account details');
//       } else {
//         res.redirect('/profile');
//       }
//     }
//   );
// });




  //need to change here from orderes to portfolio
  router.get("/portfolio", userController.isLoggedIn, userController.Portfolio,async (req, res) => {
    if(req.user) {
      res.render("portfolio", {Portfolio: req.Portfolio});
      // res.send(req.orders[1]);
  } else {
      res.redirect("/login");
  }
  });
  router.get("/orders", userController.isLoggedIn, userController.orders,async (req, res) => {
    if(req.user) {
      res.render("orders", {order: req.orders});
      // res.send(req.orders[1]);
  } else {
      res.redirect("/login");
  }
  });

  router.get("/orders/delete/:stock_symbol",userController.isLoggedIn,(req,res, next) =>{
    if(req.user) {
      const stock_symbol = req.params.stock_symbol;
      // console.log(id);
      // const query = `DELETE FROM orders WHERE USER_ID="${id}"`;
      db.query(
        `DELETE FROM orders WHERE STOCK_SYMBOL="${stock_symbol}"`,
       (err, results) =>{
        if(err){
          throw err;
        } else {
          res.redirect("/orders");
        }
       } ,
        )
      // res.send(req.orders[1]);
  } else {
      res.redirect("/login");
  }
  });


  router.get("/holdings", userController.isLoggedIn, userController.holdings,async (req, res) => {
    if(req.user) {
      res.render("holdings", {holding: req.holdings});
  } else {
      res.redirect("/login");
  }
  });


  router.get("/holdings/delete/:stock_symbol",userController.isLoggedIn,(req,res, next) =>{
    if(req.user) {
      const stock_symbol = req.params.stock_symbol;
      // console.log(id);
      // const query = `DELETE FROM orders WHERE USER_ID="${id}"`;
      db.query(
        `DELETE FROM holdings WHERE STOCK_SYMBOL="${stock_symbol}"`,
       (err, results) =>{
        if(err){
          throw err;
        } else {
          res.redirect("/holdings");
        }
       } ,
        )
      // res.send(req.orders[1]);
  } else {
      res.redirect("/login");
  }
  });
  


router.get("/stocks", userController.isLoggedIn, userController.stocks,async (req, res) => {
  if(req.user) {
    res.render("stocks", {stock: req.stocks});
} else {
    res.redirect("/login");
}
});

router.get("/watchlist", userController.isLoggedIn,(req, res) => {
  if(req.user) {
    res.render("watchlist");
} else {
    res.redirect("/login");
}
});



module.exports = router;