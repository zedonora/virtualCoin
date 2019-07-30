//bitumb - cpdax
import orderBook from "./market/orderBook";
import BithumbTrade from "./market/bithumbTrade";
import BithumbBalance from "./market/bithumbBalance";
import coinoneTrade from "./market/coinoneTrade";
import coinoneBalance from "./market/coinoneBalance";
import db from "./db";

const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise3()])
    .then(values => {
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
        coinoneTrade(500, quantity, "sell"); // KRW
      }
      if (secondBuyValue[1] - firstSellValue[1] > 0) {
        var quantity = Math.min(
          secondBuyValue[0],
          firstSellValue[0]
        ).toString();

        const bithumbTrade = new BithumbTrade(quantity);
        bithumbTrade.startAPI("sell");
        coinoneTrade(500, quantity, "buy");
      }

      var rtnBalJson = coinoneBalance();
      var curDate = new Date();
      var oldBalance = 0;
      var oldVolumne = 0;
      db.query(
        "INSERT INTO tb_balance (user_id, balance, volumne, market, currency, cur_time, made_date, modi_date )" +
          "VALUES (1, ?, ?, ?, ?, ?, date_format(now(),'%Y-%m-%d %T'), date_format(now(),'%Y-%m-%d %T'))",
        [
          rtnBalJson.avail || 0,
          rtnBalJson.balance || 0,
          "coinone",
          "ETH",
          getDateFormat(curDate)
        ]
      ).then(result => {
        console.log(result);
      });

      //TODO rtnTradeJson값 확인
      var rtnTradeJson = coinoneTrade(500, 1, "buy");
      var curBalance = rtnTradeJson.balance || 0;
      var curVolumne = rtnTradeJson.volumne || 0;

      // 비교하는 쿼리 위한 조회
      if (rtnBalJson.result == "success") {
        db.query(
          "SELECT balance, volumne FROM tb_balance WHERE market=? AND user_id=? AND currency = ? ORDER BY cur_date DESC LIMIT 1",
          ["coinone", 1, "ETH"]
          // 현재 내용 저장
        ).then(result => {
          console.log(result);
          oldBalance = result[0].balance || 0;
          oldVolumne = result[0].volumne || 0;
        });
      }
      // 수익률 계산하는 로직
      if (
        rtnTradeJson.result == "success" &&
        (oldVolumne > 0 || oldVolumne > 0)
      ) {
        var profitRate =
          (parseFloat(curBalance) * parseFloat(curVolumne) -
            parseFloat(oldBalance) * parseFloat(oldVolumne)) /
          100;
      }
      // 수익률 저장
      db.query(
        "INSERT INTO tb_profit (user_id, old_balance, cur_balance, profit_rate, currency, market, made_date, modi_date )" +
          "VALUES (1, ?, ?, ?, CURRENCY, market, date_format(now(),'%Y-%m-%d %T'), date_format(now(),'%Y-%m-%d %T'))",
        [oldBalance, curBalance, profitRate, "coinone", "ETH"]
      ).then(result => {
        console.log(result);
      });
      const bithumbBalance = new BithumbBalance();
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
