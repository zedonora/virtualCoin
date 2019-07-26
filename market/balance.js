import https from "https";

const balance = {
  promise1: function() {
    return callGetBalance(
      "bithumb",
      "https://api.bithumb.com/public/orderbook/ETH"
    ).then(result => result);
  },
  promise2: function() {
    return callGetBalance(
      "upbit",
      "https://api.upbit.com/v1/orderbook?markets=KRW-ETH"
    ).then(result => result);
  },
  promise3: function() {
    return callGetBalance(
      "coinone",
      "https://api.coinone.co.kr/orderbook/"
    ).then(result => result);
  },
  promise4: function() {
    return callGetBalance(
      "Korbit",
      "https://api.korbit.co.kr/v1/orderbook"
    ).then(result => result);
  },
  promise5: function() {
    return callGetBalance(
      "gopax",
      "https://api.gopax.co.kr/trading-pairs/ETH-KRW/book"
    ).then(result => result);
  },
  promise6: function() {
    return callGetBalance(
      "cpdax",
      "https://api.cpdax.com/v1/orderbook/ETH-KRW"
    ).then(result => result);
  }
};

const callGetBalance = (name, url, currency) => {
  console.log("callGetBalance>>>>>>" + name);
  console.log("callGetBalance>>>>>>" + url);
  return new Promise((resolve, reject) => {
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
            // KRW, ETH
            case "bithumb":
              if(currency == "KRW") {
                  tempJson["currency"] = "KRW";
                  tempJson["price"] = jsonData.price;
              } else {
                  tempJson["currency"] = "ETH";
                  tempJson["price"] = jsonData.price;
              }
              break;

            case "upbit":
              if(currency == "KRW") {
                  tempJson["currency"] = "KRW";
                  tempJson["price"] = jsonData.price;
              } else {
                  tempJson["currency"] = "ETH";
                  tempJson["price"] = jsonData.price;
              }
              break;

            case "coinone":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "poloniex":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "bitmex":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "bittrex":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "kraken":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "Korbit":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "gopax":
                if(currency == "KRW") {
                    tempJson["currency"] = "KRW";
                    tempJson["price"] = jsonData.price;
                } else {
                    tempJson["currency"] = "ETH";
                    tempJson["price"] = jsonData.price;
                }
                break;

            case "cpdax":
                if(currency == "KRW") {
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
      })
      .on("error", err => {
        console.log("error: " + err.message);
      });
  });
};

export default balance;
