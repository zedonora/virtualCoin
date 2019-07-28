import https from "https";
import dotenv from "dotenv";
dotenv.config();

const balance = {
  promise2: function() {
    return callGetBalance(
      "upbit",
      "api.upbit.com/v1/orderbook?markets=KRW-ETH"
    ).then(result => result);
  },
  promise3: function() {
    return callGetBalance(
      "coinone",
      "api.coinone.co.kr/v1/account/balance/",
      "",
      process.env.COINONE_ACCESS_TOKEN
    ).then(result => result);
  },
  promise4: function() {
    return callGetBalance("Korbit", "api.korbit.co.kr/v1/orderbook").then(
      result => result
    );
  },
  promise5: function() {
    return callGetBalance(
      "gopax",
      "api.gopax.co.kr/trading-pairs/ETH-KRW/book"
    ).then(result => result);
  },
  promise6: function() {
    return callGetBalance("cpdax", "api.cpdax.com/v1/orderbook/ETH-KRW").then(
      result => result
    );
  }
};

const callGetBalance = (name, url, currency, extraParam) => {
  console.log("callGetBalance>>>>>>" + name);
  console.log("callGetBalance>>>>>>" + url);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url,
      port: 443,
      path: "/",
      method: "GET"
    };

    const req = https.request(url, res => {
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
          // KRW, ETH
          case "bithumb":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "upbit":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "coinone":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.krw.balance;
              tempJson["size"] = jsonData.krw.avail;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.eth.balance;
              tempJson["size"] = jsonData.eth.avail;
            }
            break;

          case "poloniex":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "bitmex":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "bittrex":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "kraken":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "Korbit":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "gopax":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;

          case "cpdax":
            if (currency == "KRW") {
              tempJson["currency"] = "KRW";
              tempJson["price"] = jsonData.price;
            } else {
              tempJson["currency"] = "ETH";
              tempJson["price"] = jsonData.price;
            }
            break;
        }
        resolve(tempJson);
      });
    });

    req.on("error", err => {
      console.log("error: " + err.message);
    });

    req.end();
  });
};

export default balance;
