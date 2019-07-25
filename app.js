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

export default app;
