//bitumb - cpdax
import orderBook from "./market/orderBook";
import Bithumb from "./market/bithumbTrade";
import Coinone from "./market/coinoneTrade";
const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise3()])
    .then(values => {
      console.log(values);
      Coinone(500, 1, "buy");
      // const bithumb = new Bithumb("200000");
      // bithumb.startAPI("sell");
    })
    .catch(error => {
      console.log(error.message);
    });
};
export default trade1;
