import request from "request";
import uuidv4 from "uuidv4";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import querystring from "querystring";
const queryEncode = querystring.encode;
const sign = jsonwebtoken.sign;

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;

const body = {
  market: "KRW-ETH",
  side: "bid",
  volume: "0.01",
  price: "100",
  ord_type: "limit"
};

const query = queryEncode(body);

const hash = crypto.createHash("sha512");
const queryHash = hash.update(query, "utf-8").digest("hex");

const payload = {
  access_key: access_key,
  nonce: uuidv4(),
  query_hash: queryHash,
  query_hash_alg: "SHA512"
};

const token = sign(payload, secret_key);

const options = {
  method: "POST",
  url: server_url + "/v1/orders",
  headers: { Authorization: `Bearer ${token}` },
  json: body
};

request(options, (error, response, body) => {
  if (error) throw new Error(error);
  console.log(body);
});
