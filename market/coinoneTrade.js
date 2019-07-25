import https from "https";
import dotenv from "dotenv";
import { Base64 } from "js-base64";
import crypto from "crypto";
import logger from "../middlewares/winston";
dotenv.config();

const coinoneTrade = (price, qty, type) => {
  var sendData = {
    access_token: process.env.COINONE_ACCESS_TOKEN,
    price: price, // KRW price
    qty: qty,
    currency: "ETH"
  };

  var payload = sendData;
  var encodedPayload = getEncodedPayload(payload);
  var options = {
    hostname: "api.coinone.co.kr",
    port: 443,
    method: "POST",
    path: "/v2/order/limit_" + type + "/",
    headers: {
      "Content-type": "application/json",
      "X-COINONE-PAYLOAD": encodedPayload,
      "X-COINONE-SIGNATURE": getSignature(encodedPayload)
    }
  };

  var req = https.request(options, res => {
    let data = "";
    let jsonData = {};
    res.on("data", chunk => {
      data += chunk;
    });
    res.on("end", () => {
      jsonData = JSON.parse(data);
      if (jsonData.result == "success") {
        logger.info({
          "coinone result": "success",
          "coinone response": jsonData
        });
      } else {
        logger.error({
          "coinone result": "fail",
          "coinone msg": jsonData.errorMsg
        });
      }
      console.log(jsonData);
    });
  });

  req.on("error", e => {
    console.error(e);
  });

  req.write(JSON.stringify(payload));
  req.end();
};

const getEncodedPayload = payload => {
  payload["nonce"] = parseInt(new Date().getTime() / 1000);
  return Base64.encode(JSON.stringify(payload));
};

const getSignature = encodedPayload => {
  return crypto
    .createHmac("sha512", process.env.COINONE_SECRET_KEY)
    .update(encodedPayload)
    .digest("hex");
};
export default coinoneTrade;
