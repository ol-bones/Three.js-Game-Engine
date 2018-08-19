const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");

const config = require("./config.json");

const app = express();

app.use(require("./middleware/cors"));
app.use(express.static(__dirname + "/content"));
app.get("/", (req, res) => res.json("api"));
app.get("/data/world/0.json", (req, res) => res.json(JSON.parse(fs.readFileSync(path.join(__dirname, "content/data/world/0.json")))));

app.listen(Number(config.port), () => {
    console.log(`Started on port ${config.port}`);
});