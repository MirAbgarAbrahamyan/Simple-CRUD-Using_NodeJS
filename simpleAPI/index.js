const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const {v4: uuidv4} = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const path = "./data/data.json";

const saveData = (data) => {
    let stringify = JSON.stringify(data);
    fs.writeFileSync(path, stringify);
}

const getData = () => {
    let json = fs.readFileSync(path);
    return JSON.parse(json);
}

app.get("/users", (req, res) => {
    fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});

app.post("/users", (req, res) => {
    let data = getData();
    const id = uuidv4();
    data[id] = req.body;
    saveData(data);
    res.send({message: "OK"});
});

app.put("/users/:id", (req, res) => {
    let data = getData();
    let id = req.params.id;
    data[id].username = req.body.username;
    saveData(data);
    res.send({message: "OK"});
});

app.delete("/users/:id", (req, res) => {
    let id = req.params.id;
    let data = getData();
    delete data[id];
    saveData(data);
    res.send({message: "OK"});
});

app.listen(8123, () => {
    console.log("Server started");
});
