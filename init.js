import dotenv from "dotenv";
import app from "./app";
import logger from "./middlewares/winston";
import order from "./scheduled";
import trade1 from "./compare/trade1";

dotenv.config();
const PORT = process.env.PORT || 8000;
const handleListening = () => {
  console.log(`✅  Listening on: http://localhost:${PORT}`);
  setInterval(trade1, 5000);
  logger.info("second");
};

app.listen(PORT, handleListening);
