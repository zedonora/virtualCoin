const tradeApi = function(sendData, hostname, path, type) {
  new Promise((resolve, reject) => {
    var postData = querystring.stringify(sendData);
    var options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      }
    };
    var req = https.request(options, res => {
      console.log("statusCode:", res.statusCode);
      console.log("headers:", res.headers);

      res.on("data", d => {
        process.stdout.write(d);
      });
      res.on("end", () => {
        resolve();
      });
    });

    req.on("error", e => {
      console.error(e);
    });

    req.write(postData);
    req.end();
  });
};

export default tradeApi;
