var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const authRouter = require("./routes/auth");
const uaa = require("./middlewares/uaa");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var coursesRouter = require("./routes/courses");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const client = new MongoClient(
  "mongodb+srv://aman:12345@cluster0.lubd1.mongodb.net",
  { useUnifiedTopology: true }
);
let db;

app.use("/", function (req, res, next) {
  if (!db) {
    console.log("connecting to mongoDB");
    client.connect(function (err) {
      // connections = client.db('lab6');
      //MIU-CSR
      db = client.db("Products");
      req.db = db;
      next();
    });
  } else {
    req.db = db;
    next();
  }
});
// app.get("/get", (req, res) => {
//   console.log("amanuel");
// });
//app.use(uaa.checkToken);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;

app.listen(4000, () => {
  console.log("app running on port 4000");
});
