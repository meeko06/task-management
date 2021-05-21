/**
 * AuthVv2Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let empty = require("is-empty");
const LoginService = require("../services/LoginService");

module.exports = {
  login: async function (req, res) {
    try {
      const valuesToSet = req.body;
      let user = await LoginService.passwordLogin(
        valuesToSet.username,
        valuesToSet.password
      );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({
        user: error,
      });
    }
  },
};
