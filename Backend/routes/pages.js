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
    res.render("login");
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
  const { order_id, stock_symbol, order_type, purchase_price, shares } = req.body;
  
  // id of the user who is logged in
  const user_id = req.user.Id;


  
  //TO store data in DB
  db.query(
    "INSERT INTO ORDERS SET ?",
    {
      USER_ID: user_id,
      ORDER_ID: order_id,
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
        return res.status(200).send({ message: "Data stored in DB" });
      }
    }
    );
} else {
    res.redirect("/login");
}
 
  });
  
  router.get("/profile", userController.isLoggedIn, userController.account_details,async (req, res) => {
    if(req.user) {
        res.render("profile",{account_details: req.account_details});
        console.log(req.account_details);
    } else {
        res.redirect("/login");
    }
});





  //need to change here from orderes to portfolio
  router.get("/portfolio", userController.isLoggedIn, userController.orders,async (req, res) => {
    if(req.user) {
      res.render("portfolio", {user: req.user});
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
  

router.get("/holdings", userController.isLoggedIn, userController.holdings,async (req, res) => {
  if(req.user) {
    res.render("holdings", {holding: req.holdings});
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