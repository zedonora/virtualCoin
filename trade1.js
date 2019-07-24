//bitumb - cpdax
import orderBook from "./market/orderBook";

const trade1 = () => {
  console.log(orderBook.promise1());
  // 10번
  Promise.all([orderBook.promise1, orderBook.promise6]).then(function(values) {
    console.log(values);
    console.log(orderBook.returnJson);
    //     var firstMarket = order.orderBookJson.filter(function(market) {
    //       return market.id == "bithumb";
    //     });
    //     var secondMarket = order.orderBookJson.filter(function(market) {
    //       return market.id == "cpdax";
    //     });
    //     console.log("bitumb cpdax values>>>>>>>>>>>>>" + values);
    //     var spread =
    //       parseFloat(firstMarket[0].trade) - parseFloat(secondMarket[0].trade);
    //     console.log("spread>>>>>>>>>>" + spread);
    //     var firstMarketJson = {};
    //     var secondMarketJson = {};
    //     var hostname = "";
    //     var path = "";
    //     if (spread < 0) {
    //       hostname = "https://api.bithumb.com/";
    //       path = "trade/market_sell";
    //       firstMarketJson = {
    //         apiKey: process.env.BITUMB_API_KEY,
    //         secretKey: process.env.BITUMB_SECRET_KEY,
    //         units: parseFloat("213213123") /**입력호가 */,
    //         currency: "ETH" /**기본값:BTC */
    //       };
    //       callPost(firstMarketJson, hostname, path, "sell"); //sellFirst
    //       hostname = "https://api.coinone.co.kr/v1/";
    //       path = "limit_buy/";
    //       secondMarketJson = {
    //         access_token: process.env.COINONE_ACCESS_TOKEN,
    //         price: "4241000.0" /**KRW */,
    //         qty: "0.1"
    //       };
    //       callPost(secondMarketJson, hostname, path, "buy"); //buySecond
    //     } else {
    //       hostname = "https://api.coinone.co.kr/v1/";
    //       path = "limit_sell/";
    //       secondMarketJson = {
    //         access_token: process.env.COINONE_ACCESS_TOKEN,
    //         price: "4241000.0" /**KRW */,
    //         qty: "0.1"
    //       };
    //       callPost(secondMarketJson, hostname, path, "sell"); //sellSecond
    //       hostname = "https://api.bithumb.com/";
    //       path = "trade/market_buy";
    //       firstMarketJson = {
    //         apiKey: process.env.BITUMB_API_KEY,
    //         secretKey: process.env.BITUMB_SECRET_KEY,
    //         units: parseFloat("213213123") /**입력호가 */,
    //         currency: "ETH" /**기본값:BTC */
    //       };
    //       callPost(firstMarketJson, hostname, path, "buy"); //buyFirst
    //     }
  });
};
export default trade1;
