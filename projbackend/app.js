require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//--------------------------My Routes-----------------------
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");

const app = express();

//Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
//db coonection ended

//Middlewares added
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//Middlewares ended

//Routes start
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

//Routes End

//Port
const port = process.env.PORT || 8000;

//Server
app.listen(port, () => {
  console.log(`app is running at the port ${port}`);
});
