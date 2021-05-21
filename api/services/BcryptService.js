const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
module.exports = {
  hash: async function (input) {
    return await bcrypt.hash(input, SALT_ROUNDS);
  },

  compare: async function (input, hash) {
    return await bcrypt.compare(input, hash);
  },
};
