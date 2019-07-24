import callGetOrderBook from "./getOrderBook";
var orderBookJson = [];
const orderBook = {
  promise1: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "bithumb",
        "https://api.bithumb.com/public/orderbook/ETH"
      );
      console.log(rtnJson);
      resolve(rtnJson);
    });
  },
  promise2: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "upbit",
        "https://api.upbit.com/v1/orderbook?markets=KRW-ETH"
      );
      orderBookJson.push(rtnJson);
      resolve(orderBookJson);
    });
  },
  promise3: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "coinone",
        "https://api.coinone.co.kr/orderbook/"
      );
      orderBookJson.push(rtnJson);
      resolve(orderBookJson);
    });
  },
  promise4: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "Korbit",
        "https://api.korbit.co.kr/v1/orderbook"
      );
      orderBookJson.push(rtnJson);
      resolve(orderBookJson);
    });
  },
  promise5: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "gopax",
        "https://api.gopax.co.kr/trading-pairs/ETH-KRW/book"
      );
      orderBookJson.push(rtnJson);
      resolve(orderBookJson);
    });
  },
  promise6: function() {
    new Promise((resolve, reject) => {
      const rtnJson = callGetOrderBook(
        "cpdax",
        "https://api.cpdax.com/v1/orderbook/ETH-KRW"
      );
      console.log(rtnJson);
      resolve(rtnJson);
    });
  },
  returnJson: orderBookJson
};

// orderBook.prototype.callPost = function(sendData, hostname, path, type) {
//   new Promise((resolve, reject) => {
//     var postData = querystring.stringify(sendData);
//     var options = {
//       hostname: hostname,
//       port: 443,
//       path: path,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Content-Length": postData.length
//       }
//     };
//     var req = https.request(options, res => {
//       console.log("statusCode:", res.statusCode);
//       console.log("headers:", res.headers);

//       res.on("data", d => {
//         process.stdout.write(d);
//       });
//       res.on("end", () => {
//         resolve();
//       });
//     });

//     req.on("error", e => {
//       console.error(e);
//     });

//     req.write(postData);
//     req.end();
//   });
// };

export default orderBook;
