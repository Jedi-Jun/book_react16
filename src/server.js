const express = require('express');
const jsonServer = require('json-server');
const chokidar = require('chokidar');
const cors = require('cors');
const app = express();
const { DataTypes } = require('./data/Types');
console.log(DataTypes);

const fileName = process.argv[2] || './data.js';
const port = process.argv[3] || 3500;

let router = undefined;

const createServer = () => {
    delete require.cache[require.resolve(fileName)];
    setTimeout(() => {
        router = jsonServer.router(fileName.endsWith(".js")
            ? require(fileName)() : fileName);
            console.log(fileName);
    }, 100);
}

createServer();
app.use(cors());
app.use(jsonServer.bodyParser);
app.use("/api", (req, res, next) => router(req, res, next));

chokidar.watch(fileName).on('change', (event, path) => {
  console.log(event, path);
  console.log("Reloading web service data...");
  createServer();
  console.log("Reloading web service data complete.");
});

app.listen(port, () => console.log('Web service running on port: %d', port));