const orderBook = {
    orderBookJson:{}
    ,promise1 : new Promise((resolve, reject) => {
        callGetOrderBook("bithumb", "https://api.bithumb.com/public/orderbook/ETH");
        resolve(orderBookJson);
    })
    ,promise2 : new Promise((resolve, reject) => {
        callGetOrderBook(
            "upbit",
            "https://api.upbit.com/v1/orderbook?markets=KRW-ETH"
          );
          resolve(orderBookJson);
        })
    ,promise3 : new Promise((resolve, reject) => {
        callGetOrderBook("coinone", "https://api.coinone.co.kr/orderbook/");
        resolve(orderBookJson);
    })
    ,promise4 : new Promise((resolve, reject) => {
        callGetOrderBook("Korbit", "https://api.korbit.co.kr/v1/orderbook");
        resolve(orderBookJson);
    })
    ,promise5 : new Promise((resolve, reject) => {
        callGetOrderBook(
                "gopax",
                "https://api.gopax.co.kr/trading-pairs/ETH-KRW/book"
              );
              resolve(orderBookJson);
    })
    ,promise6 : new Promise((resolve, reject) => {
        callGetOrderBook("cpdax", "https://api.cpdax.com/v1/orderbook/ETH-KRW");
        resolve(orderBookJson);
    })
    ,callGetOrderBook : function(name, url) {
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

                case "cpdax":
                  tempJson["sell"] =
                    jsonData.bids[0].size + "@" + jsonData.bids[0].price;
                  tempJson["buy"] =
                    jsonData.asks[0].size + "@" + jsonData.asks[0].price;
                  break;
              }

              orderBookJson.push(tempJson);
            });
          })
          .on("error", err => {
            console.log("error: " + err.message);
          });
    }
    , callPost : function(sendData, hostname, path, type) {
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
    }
};
export default orderBook;