//bitumb - cpdax
import orderBook from "./market/orderBook";
import BithumbTrade from "./market/bithumbTrade";
import BithumbBalance from "./market/bithumbBalance";
import Coinone from "./market/coinoneTrade";
const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise3()])
    .then(values => {
      console.log(values);
      Coinone(500, 1, "buy");
      // const bithumbTrade = new BithumbTrade("200000");
      // bithumbTrade.startAPI("sell");
      // const bithumbBalance = new BithumbBalance();
      // bithumbBalance.startAPI();
    })
    .catch(error => {
      console.log(error.message);
    });
};
export default trade1;
