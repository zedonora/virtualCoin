//bitumb - cpdax
import orderBook from "./market/orderBook";
import Bithumb from "./market/bithumbTrade";
const trade1 = () => {
  // 10번
  Promise.all([orderBook.promise1(), orderBook.promise6()])
    .then(values => {
      console.log(values);
      // const bithumb = new Bithumb("200000");
      // bithumb.startAPI("sell");
    })
    .catch(error => {
      console.log(error.message);
    });
};
export default trade1;
