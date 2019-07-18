const request = require("request");
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");
const sign = require("jsonwebtoken").sign;
const queryEncode = require("querystring").encode;

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;

const body = {
  market: "KRW-BTC",
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
