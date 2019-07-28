import dotenv from "dotenv";
import app from "./app";
import logger from "./middlewares/winston";
import trade1 from "./trade1";
import dnsTest from "./dnsTest";

dotenv.config();
const PORT = process.env.PORT || 8000;
const handleListening = () => {
  console.log(`✅  Listening on: http://localhost:${PORT}`);
  setInterval(trade1, process.env.POLLING_OB_PERIOD);
  //logger.info("second");
};

app.listen(PORT, handleListening);
