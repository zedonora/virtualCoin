const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const https = require("https");

const app = express();
app.listen(8000);
app.use(methodOverride()); // PUT, DELETE를 지원 안 하는 클라이언트를 위해
app.use(bodyParser.json()); // body의 데이터를 json형식으로 받음
app.use(bodyParser.urlencoded({ extended: true })); // qs모듈로 쿼리스트링 파싱

// app.get("/user/:name", (req, res) => {
//   res.json({ name: req.params.name });
// });

let compareJson = [];

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/index.html", { json: true }, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading");
    }
    res.writeHead(200, { "content-type": "text/html" });
    res.end(data);
    Promise.all([promise1, promise2, promise3, promise4]).then(function(
      values
    ) {
      console.log("values>>>>>>>>>>>>>" + values);
    });
    console.log(compareJson);
  });
});

const promise1 = new Promise((resolve, reject) => {
  https
    .get("https://api.bithumb.com/public/ticker/ETH", res => {
      let data = "";
      let jsonData = {};
      let tempJson = {};
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        jsonData = JSON.parse(data);
        tempJson["id"] = "bithumb";
        tempJson["price"] = jsonData.data.closing_price;
        tempJson["size"] = jsonData.data.units_traded;
        compareJson.push(tempJson);
        resolve(compareJson);
      });
    })
    .on("error", err => {
      console.log("error: " + err.message);
    });
});

const promise2 = new Promise((resolve, reject) => {
  https
    .get("https://api.upbit.com/v1/ticker?markets=KRW-ETH", res => {
      let data = "";
      let jsonData = {};
      let tempJson = {};
      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        jsonData = JSON.parse(data);
        tempJson["id"] = "upbit";
        tempJson["price"] = jsonData[0].trade_price;
        tempJson["size"] = jsonData[0].trade_volume;
        compareJson.push(tempJson);
        resolve(compareJson);
      });
    })
    .on("error", err => {
      console.log("error: " + err.message);
    });
});

const promise3 = new Promise((resolve, reject) => {
  https
    .get("https://api.coinone.co.kr/ticker/?currency=eth", res => {
      let data = "";
      let jsonData = {};
      let tempJson = {};
      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        jsonData = JSON.parse(data);
        tempJson["id"] = "coinone";
        tempJson["price"] = jsonData.last;
        tempJson["size"] = jsonData.volume;
        compareJson.push(tempJson);
        resolve(compareJson);
      });
    })
    .on("error", err => {
      console.log("error: " + err.message);
    });
});

const promise4 = Promise.resolve("aasdas");
