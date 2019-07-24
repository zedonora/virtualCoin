import dotenv from "dotenv";
import methodOverride from "method-override";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fs from "fs";
import logger from "./middlewares/winston";

const app = express();

app.use(helmet()); // security부분
dotenv.config();
app.use(methodOverride()); // PUT, DELETE를 지원 안 하는 클라이언트를 위해
app.use(bodyParser.json()); // body의 데이터를 json형식으로 받음
app.use(bodyParser.urlencoded({ extended: true })); // qs모듈로 쿼리스트링 파싱
app.use("/uploads", express.static("uploads"));
app.use(express.static("static"));
app.use(cookieParser()); // cookie 정보
app.use(bodyParser.json()); // body 값
app.use(bodyParser.urlencoded({ extended: true })); // body 값
app.use(morgan("dev")); // log부분

let compareJson = [];
let orderBookJson = [];

app.get("/index", (req, res) => {
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

export default app;
