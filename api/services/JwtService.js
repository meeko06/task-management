let jwt = require("jwt-simple");
const moment = require("moment");
const empty = require("is-empty");

let jwt_key = sails.config.custom.jwt.secret;
let jwt_exp = sails.config.custom.jwt.exp;

module.exports = {
  createToken: function (payload) {
    let exp = Math.floor(moment().add(jwt_exp).valueOf() / 1000);
    let payloadData = Object.assign(payload, { exp });
    console.log("payloadData", payloadData);
    // sails.log.debug(`JwtService: ` + JSON.stringify(payloadData));
    return jwt.encode(payloadData, jwt_key);
  },

  decodeToken: function (token) {
    return decodeToken(token);
  },

  decodeAuthHeader: function (header) {
    console.log("header", header);
    console.log("header", header.split(" ")[1]);
    return empty(header) ? false : decodeToken(header.split(" ")[1]);
  },
};
function decodeToken(token) {
  try {
    return jwt.decode(token, jwt_key);
  } catch (error) {
    sails.log.debug(error);
    return false;
  }
}
