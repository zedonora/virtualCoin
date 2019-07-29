import https from "https";
import dotenv from "dotenv";
import { Base64 } from "js-base64";
import crypto from "crypto";
import logger from "../middlewares/winston";
import db from "../db";
dotenv.config();

const coinoneBalance = () => {
  var sendData = {
    access_token: process.env.COINONE_ACCESS_TOKEN
  };

  var payload = sendData;
  var encodedPayload = getEncodedPayload(payload);
  var options = {
    hostname: "api.coinone.co.kr",
    port: 443,
    method: "POST",
    path: "/v2/account/balance/",
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
      db.query(
        "SELECT a.user_id, a.old_balance FROM t_profit a INNER JOIN user b ON a.user_id = b.id"
      ).then(result => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(result[0]);
        var data = result[0];
        // 가지고 있는 값과 현재 값을 비교
        if (data.cur_balance != jsonData.eth.balance) {
        }
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
      });

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
export default coinoneBalance;
