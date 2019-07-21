import dotenv from "dotenv";
import app from "./app";
import logger from "./middlewares/winston";
import order from "./scheduled";

dotenv.config();
const PORT = process.env.PORT || 8000;
const handleListening = () => {
  console.log(`✅  Listening on: http://localhost:${PORT}`);
  //setInterval(order, 5000);
  logger.info("second");
};

app.listen(PORT, handleListening);
