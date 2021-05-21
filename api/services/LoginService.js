const ValidatorService = require("../services/ValidatorService");
const forms = require("../forms");
const empty = require("is-empty");
module.exports = {
  passwordLogin: async function (username, password) {
    try {
      let clean = ValidatorService.clean({ username, password }, forms.AuthV2);
      let validation = ValidatorService.validate(clean, forms.AuthV2);
      if (!empty(validation)) {
        throw { Errors: validation };
      } else {
        let userData = await User.findOne({ username });
        if (empty(userData)) {
          throw { Errors: "User does not exist" };
        } else {
          // compare password
          let isPasswordValid = await User.comparePassword(password, userData);
          console.log("isPasswordValid", isPasswordValid);
          if (!isPasswordValid) {
            throw { Errors: "Password does not match" };
          } else {
            let payload = {
              user_id: userData.id,
              username: userData.username,
            };
            const safeUser = _.omit(_.cloneDeep(userData), [
              "password",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ]);
            return {
              token: JwtService.createToken(payload),
              ...safeUser,
            };
          }
        }
      }
    } catch (Error) {
      console.error(Error);
      throw Error;
    }
  },
};
