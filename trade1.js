//bitumb - cpdax
import orderBook from "./market/orderBook";
import BithumbTrade from "./market/bithumbTrade";
import BithumbBalance from "./market/bithumbBalance";
import coinoneTrade from "./market/coinoneTrade";
import coinoneBalance from "./market/coinoneBalance";
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
      coinoneBalance();
      coinoneTrade(500, 1, "buy");
      const bithumbTrade = new BithumbTrade("200000");
      bithumbTrade.startAPI("sell");
      const bithumbBalance = new BithumbBalance();
      bithumbBalance.startAPI();
    })
    .catch(error => {
      console.log(error.message);
    });
};
export default trade1;
