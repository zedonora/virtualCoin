//bitumb - coinone
import orderBook from "./market/orderBook";
import BithumbTrade from "./market/bithumbTrade";
import BithumbBalance from "./market/bithumbBalance";
import coinoneTrade from "./market/coinoneTrade";
import coinoneBalance from "./market/coinoneBalance";
import logger from "./middlewares/winston";

const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise3()])
    .then(values => {
      const bithumbBalance = new BithumbBalance();
      coinoneBalance();
      bithumbBalance.startAPI();
      
      logger.info({ "bithumb, coinone orderbook": values, "time": getDateFormat(new Date()) });
      var firstMarket = values[0];
      var secondMarket = values[1];
      // 0: 수량, 1: 금액
      var firstSellValue = firstMarket.sell.split("@");
      var firstBuyValue = firstMarket.buy.split("@");
      var secondSellValue = secondMarket.sell.split("@");
      var secondBuyValue = secondMarket.buy.split("@");

      // 매수 - 매도
      if (firstBuyValue[1] - secondSellValue[1] > 0) {
        var quantity = Math.min(
          firstBuyValue[0],
          secondSellValue[0]
        ).toString();

        const bithumbTrade = new BithumbTrade(quantity);
        bithumbTrade.startAPI("buy");
        coinoneTrade(1000, quantity, "sell"); // KRW
      }
      if (secondBuyValue[1] - firstSellValue[1] > 0) {
        var quantity = Math.min(
          secondBuyValue[0],
          firstSellValue[0]
        ).toString();

        const bithumbTrade = new BithumbTrade(quantity);
        bithumbTrade.startAPI("sell");
        coinoneTrade(1000, quantity, "buy");
      }

      coinoneBalance();
      bithumbBalance.startAPI();
    })
    .catch(error => {
      console.log(error.message);
    });
};

var getDateFormat = function(date) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();

  return [
    this.getFullYear(),
    "-",
    (month > 9 ? "" : "0") + month,
    "-",
    (day > 9 ? "" : "0") + day,
    " ",
    (hh > 9 ? "" : "0") + hh,
    ":",
    (mm > 9 ? "" : "0") + mm,
    ":",
    (ss > 9 ? "" : "0") + ss
  ].join("");
};

export default trade1;
