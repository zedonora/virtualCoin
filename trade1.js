//bitumb - cpdax
import orderBook from "./market/orderBook";
import BithumbTrade from "./market/bithumbTrade";
import BithumbBalance from "./market/bithumbBalance";
import coinoneTrade from "./market/coinoneTrade";
import coinoneBalance from "./market/coinoneBalance";
import db from "../db";

const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise3()])
    .then(values => {
      console.log(values);
      // var aResps = values;  // console.log(aResps)
      // pB = parseFloat ( aResps[0].data.data.average_price )
      // pU = parseFloat( aResps[1].data[0].trade_price )
      // spread = pB - pU
      // console.log( pB) ; console.log(  pU);
      // console.log(  spread )
      
      // TODO rtnBalJson값 확인
      var rtnBalJson = coinoneBalance();
      var curDate = new Date();
      var oldBalance = 0;
      var oldVolumne = 0;
      // 현재 내용 저장
      db.query(
          "INSERT INTO tb_balance (user_id, balance, volumne, market, currency, cur_time, made_date, modi_date )"+
          "VALUES (1, ?, ?, ?, ?, ?, date_format(now(),'%Y-%m-%d %T'), date_format(now(),'%Y-%m-%d %T'))"
          ,[rtnBalJson.balance, rtnBalJson.volumne, "coinone", "ETH", getDateFormat(curDate)]
      ).then(result => {
          console.log(result);
      });
      
      // TODO rtnTradeJson값 확인
      var rtnTradeJson = coinoneTrade(500, 1, "buy");
      var curBalance = rtnTradeJson.balance;
      var curVolumne = rtnTradeJson.volumne;
      
      // 비교하는 쿼리 위한 조회
      if (rtnBalJson.result == "success") {
          db.query(
              "SELECT balance, volumne FROM tb_balance WHERE market=? AND user_id=? AND currency = ? ORDER BY cur_date DESC LIMIT 1"
              ,["coinone", 1, "ETH"]
          ).then(result => {
              console.log(result);
              oldBalance = result[0].balance;
              oldVolumne = result[0].volumne;
          });
      }
      
      // 수익률 계산하는 로직
      if (rtnTradeJson.result == "success" && (oldVolumne > 0 || oldVolumne > 0)) {
          var profitRate = ((parseFloat(curBalance) * parseFloat(curVolumne)) - (parseFloat(oldBalance) * parseFloat(oldVolumne))) / 100
      }
      
      // 수익률 저장
      db.query(
          "INSERT INTO tb_profit (user_id, old_balance, cur_balance, profit_rate, currency, market, made_date, modi_date )" + 
          "VALUES (1, ?, ?, ?, CURRENCY, market, date_format(now(),'%Y-%m-%d %T'), date_format(now(),'%Y-%m-%d %T'))"
          ,[oldBalance, curBalance, profitRate, "coinone", "ETH"]
      ).then(result => {
          console.log(result);
      });
      
      const bithumbTrade = new BithumbTrade("200000");
      bithumbTrade.startAPI("sell");
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

    return [this.getFullYear(),
            '-',
            (month>9 ? '' : '0') + month,
          '-',
            (day>9 ? '' : '0') + day,
          ' ',
          (hh>9 ? '' : '0') + hh,
          ':',
            (mm>9 ? '' : '0') + mm,
          ':',
            (ss>9 ? '' : '0') + ss
           ].join('');
};

export default trade1;
