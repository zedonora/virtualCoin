import dotenv from "dotenv";
import app from "./app";
import logger from "./middlewares/winston";
import trade1 from "./trade1";
import dnsTest from "./dnsTest";

dotenv.config();
const PORT = process.env.PORT || 8000;
const handleListening = () => {
  console.log(`✅  Listening on: http://localhost:${PORT}`);
  trade1();
  //setInterval(trade1, 5000);
  //logger.info("second");
};

app.listen(PORT, handleListening);
