const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connect = require("./db/dbconnect")
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/authentication");

require("dotenv").config();

const PORT = process.env.PORT

app.use(bodyParser.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.use("/auth", authRouter)

connect();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});