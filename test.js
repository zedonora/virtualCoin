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
app.use(express.static("static"));

let compareJson = [];
let orderBookJson = [];

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

app.get("/push", function(req, res) {
  res.sendFile(__dirname + "/static/push.html");
});

app.get("/order_book", function(req, res) {
  fs.readFile(__dirname + "/static/orderBook.html", { json: true }, function(
    err,
    data
  ) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading");
    }
    res.writeHead(200, { "content-type": "text/html" });
    res.end(data);

    const orderBookUrl = {
      bithumb: "https://api.bithumb.com/public/orderbook/ETH",
      upbit: "https://api.upbit.com/v1/orderbook?markets=KRW-ETH",
      coinone: "https://api.coinone.co.kr/orderbook/",
      poloniex:
        "https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_ETH&depth=1",
      bitmex:
        "https://www.bitmex.com/api/v1/orderBook/L2?symbol=ETHUSD&depth=1",
      bittrex:
        "https://api.bittrex.com/api/v1.1/public/getorderbook?market=USD-ETH&type=both",
      kraken: "https://api.kraken.com/0/public/Depth?pair=XETHZUSD&count=1",
      Korbit: "https://api.korbit.co.kr/v1/orderbook",
      gopax: "https://api.gopax.co.kr/trading-pairs/ETH-KRW/book"
    };
    for (let key in orderBookUrl) {
      callGetOrderBook(key, orderBookUrl[key]);
    }
    console.log("orderBookJson start>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(orderBookJson);
    console.log("orderBookJson end>>>>>>>>>>>>>>>>>>>>>>>>>");
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

const callGetOrderBook = (name, url) => {
  console.log("callGetOrderBook>>>>>>" + name);
  https
    .get(url, res => {
      let data = "";
      let jsonData = {};
      let tempJson = {};
      res.on("data", chunk => {
        data += chunk;
      });
      res.on("end", () => {
        jsonData = JSON.parse(data);
        tempJson["id"] = name;
        switch (name) {
          //매도물량@최소매도호가, 매수물량@최대매수호가
          case "bithumb":
            tempJson["sell"] =
              jsonData.data.bids[0].quantity +
              "@" +
              jsonData.data.bids[0].price;
            tempJson["buy"] =
              jsonData.data.asks[0].quantity +
              "@" +
              jsonData.data.asks[0].price;
            break;

          case "upbit":
            tempJson["sell"] =
              jsonData[0].orderbook_units[0].bid_size +
              "@" +
              jsonData[0].orderbook_units[0].bid_price;
            tempJson["buy"] =
              jsonData[0].orderbook_units[0].ask_size +
              "@" +
              jsonData[0].orderbook_units[0].ask_price;
            break;

          case "coinone":
            tempJson["sell"] =
              jsonData.bid[0].qty + "@" + jsonData.bid[0].price;
            tempJson["buy"] = jsonData.ask[0].qty + "@" + jsonData.ask[0].price;
            break;

          case "poloniex":
            tempJson["sell"] =
              jsonData.bids[0][0][0] + "@" + jsonData.bids[0][0][1];
            tempJson["buy"] =
              jsonData.asks[0][0][0] + "@" + jsonData.asks[0][0][1];
            break;

          case "bitmex":
            tempJson["sell"] = jsonData[0].size + "@" + jsonData[0].price;
            tempJson["buy"] = jsonData[1].size + "@" + jsonData[1].price;
            break;

          case "bittrex":
            tempJson["sell"] =
              jsonData.result.sell[0].Quantity +
              "@" +
              jsonData.result.sell[0].Rate;
            tempJson["buy"] =
              jsonData.result.buy[0].Quantity +
              "@" +
              jsonData.result.buy[0].Rate;
            break;

          case "kraken":
            tempJson["sell"] =
              jsonData.result.XETHZUSD.bids[0][1] +
              "@" +
              jsonData.result.XETHZUSD.bids[0][0];
            tempJson["buy"] =
              jsonData.result.XETHZUSD.asks[0][1] +
              "@" +
              jsonData.result.XETHZUSD.asks[0][0];
            break;

          case "Korbit":
            tempJson["sell"] =
              jsonData.bids[0][0][1] + "@" + jsonData.bids[0][0][0];
            tempJson["buy"] =
              jsonData.asks[0][0][1] + "@" + jsonData.asks[0][0][0];
            break;

          case "gopax":
            tempJson["sell"] = jsonData.bid[0][2] + "@" + jsonData.bid[0][1];
            tempJson["buy"] = jsonData.ask[0][2] + "@" + jsonData.ask[0][1];
            break;
        }

        orderBookJson.push(tempJson);
      });
    })
    .on("error", err => {
      console.log("error: " + err.message);
    });
};

const callPost = (sendData, hostname, path, type) => {
  new Promise((resolve, reject) => {
    var postData = querystring.stringify(sendData);
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
