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



        // const https = require('https');
/*
const apiKey = '4PWJFHCIPVWO07VP';
const symbols = ['AAPL', 'GOOG', 'MSFT', 'AMZN']; // Replace with the stock symbols you want to look up   
const stockData = [];

symbols.forEach((symbol) => {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
        const quoteData = JSON.parse(data)["Global Quote"];
        stockData.push(quoteData);
        if(stockData.length === symbols.length){
            console.log(stockData);
        }
    });
  }).on('error', (err) => {
    console.log('Error: ' + err.message);
  });
});*/


  
  
});


router.get("/profile", userController.isLoggedIn,(req, res) => {
    if(req.user) {
        res.render("profile",{user: req.user});
    } else {
        res.redirect("/login");
    }
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