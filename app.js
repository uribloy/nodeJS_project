const dotenv = require("dotenv/config");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const chalk = require("chalk");
const cors = require("cors");

const usersRouter = require("./routes/usersRouter");
const cardsRouter = require("./routes/cardsRouter");

mongoose
    .connect(config.get("mongoDB.MONGO_URI"))
    .then(() => console.log(chalk.blue("connected to db successfully")))
    .catch((err) => console.error(chalk.red("cloud not connect to db", err)));

const app = express();

app.use(cors());

app.use(morgan(chalk.red(":date | :method | :url | :status | :response-time ms"), {
    skip: function (req, res) {
        return res.statusCode < 400;
    }
}));
app.use(morgan(chalk.blue(":date | :method | :url | :status | :response-time ms"), {
    skip: function (req, res) {
        return res.statusCode > 399;
    }
}));

app.use(express.json());
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use(express.static("public"));
app.use("*", (req, res) => {
    res.status(404).send("page not found");
});

app.listen(config.get("server.PORT"), () => console.log(chalk.yellow(`listening on port ${config.get("server.PORT")}`)));