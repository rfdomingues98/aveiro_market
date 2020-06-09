const createError = require('http-errors');
const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const passport = require("passport");
const Sequelize = require("sequelize");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
const flash = require("connect-flash");

require("dotenv").config();

// Passport config
const models = require("./db/models");
require("./config/passport")(passport, models.Users);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const cartRouter = require("./routes/cart");

const app = express();

// Database
const checkIfDbExists = require("./config/database").checkIfDbExists;
checkIfDbExists();
const db = require("./config/database").db;
db.authenticate()
  .then(() => {
    console.log("MARIADB: Connection has been established successfully!");
  })
  .catch((err) => {
    console.error("MARIADB: Unable to connect to the database: ", err);
  });

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
    helpers: require("./helpers/handlebars.js").helpers,
  })
);

app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/jquery",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
  "/popper.js",
  express.static(path.join(__dirname, "node_modules/popper.js/dist"))
);
app.use(
  "/font-awesome",
  express.static(path.join(__dirname, "node_modules/font-awesome"))
);
app.use(
  "/rateit",
  express.static(path.join(__dirname, "node_modules/jquery.rateit/scripts"))
);

// Express Session
app.use(
  session({
    store: new SessionStore({
      db,
    }),
    secret: process.env.SESSION_SECRET,
    resave: "true",
    saveUninitialized: "true",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setup flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/cart", cartRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err.message;
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;