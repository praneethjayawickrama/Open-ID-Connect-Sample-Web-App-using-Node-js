//praneethjayawikckrama

"use strict";
const openIdClient = require('openid-client');

// ten seconds as milliseconds, configure as needed:

openIdClient.Issuer.defaultHttpOptions.timeout = 10000; 
const express = require("express");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;






let app = express();

// App settings
app.set("view engine", "pug");

// App middleware
app.use("/static", express.static("static"));

app.use(session({
  resave: true,  
  saveUninitialized: true,   
  cookie: { httpOnly: true },
  secret: "long random string"
}));

let oidc = new ExpressOIDC({
  issuer: "https://dev-522132.oktapreview.com/oauth2/default",
  client_id: "0oagdunvwp7c7dMqi0h7",
  client_secret: "X8MlxzvcLFRQeb4jZOeXIqruPIK4nRP2Qe7SbG_X",
  redirect_uri: "http://localhost:3000/authorization-code/callback",
  routes: {
    callback: { defaultRedirect: "/dashboard" }
  },
  scope: 'openid profile'
});


// App routes

app.use(oidc.router);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", oidc.ensureAuthenticated(), (req, res) => {
  console.log(req.userinfo);
  res.render("dashboard", { user: req.userinfo });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

oidc.on("ready", () => {
    app.listen(3000);
  });
  
oidc.on("error", err => {
    console.error(err);
  });



