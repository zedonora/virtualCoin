import dotenv from "dotenv";
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const https = require("https");
const querystring = require("querystring");
const app = express();

dotenv.config();
app.listen(process.env.PORT);
app.use(methodOverride()); // PUT, DELETE를 지원 안 하는 클라이언트를 위해
app.use(bodyParser.json()); // body의 데이터를 json형식으로 받음
app.use(bodyParser.urlencoded({ extended: true })); // qs모듈로 쿼리스트링 파싱
app.use("/static", express.static("static"));

let compareJson = [];
let tradePercent = 0,
  comparePercent = 0;

app.get("/", (req, res) => {
  fs.readFile(__dirname + "/static/index.html", { json: true }, function(
    err,
    data
  ) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading");
    }
    res.writeHead(200, { "content-type": "text/html" });
    res.end(data);
    Promise.all([promise1, promise2, promise3]).then(function(values) {
      var firstMarket = compareJson.filter(function(market) {
        return market.id == "bithumb";
      });
      var secondMarket = compareJson.filter(function(market) {
        return market.id == "coinone";
      });
      console.log("values>>>>>>>>>>>>>" + values);
      var spread =
        parseFloat(firstMarket[0].trade) - parseFloat(secondMarket[0].trade);

      console.log("spread>>>>>>>>>>" + spread);
      var firstMarketJson = {};
      var secondMarketJson = {};
      var hostname = "";
      var path = "";
      if (spread < 0) {
        hostname = "https://api.bithumb.com/";
        path = "trade/market_sell";
        firstMarketJson = {
          apiKey: process.env.BITUMB_API_KEY,
          secretKey: process.env.BITUMB_SECRET_KEY,
          units: parseFloat("213213123") /**입력호가 */,
          currency: "ETH" /**기본값:BTC */
        };
        callPost(firstMarketJson, hostname, path, "sell"); //sellFirst

        hostname = "https://api.coinone.co.kr/v1/";
        path = "limit_buy/";
        secondMarketJson = {
          access_token: process.env.COINONE_ACCESS_TOKEN,
          price: "4241000.0" /**KRW */,
          qty: "0.1"
        };
        callPost(secondMarketJson, hostname, path, "buy"); //buySecond
      } else {
        hostname = "https://api.coinone.co.kr/v1/";
        path = "limit_sell/";
        secondMarketJson = {
          access_token: process.env.COINONE_ACCESS_TOKEN,
          price: "4241000.0" /**KRW */,
          qty: "0.1"
        };
        callPost(secondMarketJson, hostname, path, "sell"); //sellSecond

        hostname = "https://api.bithumb.com/";
        path = "trade/market_buy";
        firstMarketJson = {
          apiKey: process.env.BITUMB_API_KEY,
          secretKey: process.env.BITUMB_SECRET_KEY,
          units: parseFloat("213213123") /**입력호가 */,
          currency: "ETH" /**기본값:BTC */
        };
        callPost(firstMarketJson, hostname, path, "buy"); //buyFirst
      }
    });
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
        tempJson["trade"] = jsonData.data.average_price;
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
        tempJson["trade"] = jsonData[0].trade_price;
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
        tempJson["trade"] = jsonData.last;
        compareJson.push(tempJson);
        resolve(compareJson);
      });
    })
    .on("error", err => {
      console.log("error: " + err.message);
    });
});

const callPost = (sendData, hostname, path, type) => {
  new Promise((resolve, reject) => {
    var options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    var postData = querystring.stringify(sendData);
    var req = https.request(options, res => {
      console.log("statusCode:", res.statusCode);
      console.log("headers:", res.headers);

      res.on("data", d => {
        process.stdout.write(d);
      });
      res.on("end", () => {
        resolve();
      });
    });

    req.on("error", e => {
      console.error(e);
    });

    req.write(postData);
    req.end();
  });
};
