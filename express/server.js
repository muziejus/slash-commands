'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Please use POST</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => {
  const {command, text} = req.body;
  const response = new Promise((resolve, reject) => {
    if(command === "/degrees") {
      const number = parseInt(text.split(" ")[0], 10);
      resolve({
        "response_type": "in_channel",
        "text": `“${number}” could be ${(number - 32) * 5/9}°C or ${(number * 9/5) + 32}°F. Use context to decide.`
      });
    } else {
      reject({ text: "I couldn't parse that request" });
    }
  });
  return response.then(result => res.json(result));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
