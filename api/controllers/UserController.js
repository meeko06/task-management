/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { Sails } = require("sails");
const ValidatorService = require("../services/ValidatorService");
const forms = require("../forms");
const empty = require("is-empty");
module.exports = {
  create: async function (req, res) {
    let valuesToSet = req.body;
    try {
      let clean = ValidatorService.clean(valuesToSet, forms.User);
      let validation = ValidatorService.validate(clean, forms.User);
      if (!empty(validation)) {
        return res.status(400).json({ Errors: validation });
      } else {
        const createdUser = await User.create(valuesToSet).fetch();
        const safeUser = _.omit(createdUser, ["password"]);
        return res.status(201).json(safeUser);
      }
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },
};
