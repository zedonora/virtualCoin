import https from "https";

const orderBook = {
  promise1: function() {
    return callGetOrderBook(
      "bithumb",
      "https://api.bithumb.com/public/orderbook/ETH"
    ).then(result => result);
  },
  promise2: function() {
    return callGetOrderBook(
      "upbit",
      "https://api.upbit.com/v1/orderbook?markets=KRW-ETH"
    ).then(result => result);
  },
  promise3: function() {
    return callGetOrderBook(
      "coinone",
      "https://api.coinone.co.kr/orderbook/"
    ).then(result => result);
  },
  promise4: function() {
    return callGetOrderBook(
      "Korbit",
      "https://api.korbit.co.kr/v1/orderbook"
    ).then(result => result);
  },
  promise5: function() {
    return callGetOrderBook(
      "gopax",
      "https://api.gopax.co.kr/trading-pairs/ETH-KRW/book"
    ).then(result => result);
  },
  promise6: function() {
    return callGetOrderBook(
      "cpdax",
      "https://api.cpdax.com/v1/orderbook/ETH-KRW"
    ).then(result => result);
  }
};

const callGetOrderBook = (name, url) => {
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
            //매도물량@최소매도호가, 매수물량@최대매수호가
            case "bithumb":
              tempJson["sell"] =
                jsonData.data.asks[0].quantity +
                "@" +
                jsonData.data.asks[0].price;
              tempJson["buy"] =
                jsonData.data.bids[0].quantity +
                "@" +
                jsonData.data.bids[0].price;
              break;

            case "upbit":
              tempJson["sell"] =
                jsonData[0].orderbook_units[0].ask_size +
                "@" +
                jsonData[0].orderbook_units[0].ask_price;
              tempJson["buy"] =
                jsonData[0].orderbook_units[0].bid_size +
                "@" +
                jsonData[0].orderbook_units[0].bid_price;
              break;

            case "coinone":
              tempJson["sell"] =
                jsonData.ask[0].qty + "@" + jsonData.ask[0].price;
              tempJson["buy"] =
                jsonData.bid[0].qty + "@" + jsonData.bid[0].price;
              break;

            case "poloniex":
              tempJson["sell"] =
                jsonData.asks[0][0][0] + "@" + jsonData.asks[0][0][1];
              tempJson["buy"] =
                jsonData.bids[0][0][0] + "@" + jsonData.bids[0][0][1];
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
                jsonData.result.XETHZUSD.asks[0][1] +
                "@" +
                jsonData.result.XETHZUSD.asks[0][0];
              tempJson["buy"] =
                jsonData.result.XETHZUSD.bids[0][1] +
                "@" +
                jsonData.result.XETHZUSD.bids[0][0];
              break;

            case "Korbit":
              tempJson["sell"] =
                jsonData.asks[0][0][1] + "@" + jsonData.asks[0][0][0];
              tempJson["buy"] =
                jsonData.bids[0][0][1] + "@" + jsonData.bids[0][0][0];
              break;

            case "gopax":
              tempJson["sell"] = jsonData.ask[0][2] + "@" + jsonData.ask[0][1];
              tempJson["buy"] = jsonData.bid[0][2] + "@" + jsonData.bid[0][1];
              break;

            case "cpdax":
              tempJson["sell"] =
                jsonData.asks[0].size + "@" + jsonData.asks[0].price;
              tempJson["buy"] =
                jsonData.bids[0].size + "@" + jsonData.bids[0].price;
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

export default orderBook;
