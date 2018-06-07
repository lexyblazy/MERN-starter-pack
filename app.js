const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { DB, SECRET } = require("./config/keys");
const authRoutes = require("./routes/authRoutes");

// connect to the database;
mongoose
  .connect(DB)
  .then(() => {
    //eslint-disable-next-line no-console
    console.log("Connection to database was successful");
  })
  .catch(error => {
    //eslint-disable-next-line no-console
    console.log("Could not connect to database", { error });
  });
// some helpful middleware to make our lives easier
app.enable("trust proxy");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    keys: [SECRET],
    maxAge: 604800000
  })
);
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

//pull in our passport configuratin
require("./services/passport");

//load up routes
app.use(authRoutes);

// if we are in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  // express will serve up our static assets such as index.html, main.js and css
  app.use(express.static("client/build"));

  //for any set of routes that are not defined within out app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//and of course, listen on this port...
app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log("Server is up and running");
});
