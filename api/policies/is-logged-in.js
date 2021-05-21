const JwtService = require("../services/JwtService");

/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, next) {
  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  // if (req.me) {
  //   return proceed();
  // }

  //--•
  // Otherwise, this request did not come from a logged-in user.
  // return res.unauthorized();
  const token = req.get("Authorization");
  const isTokenValid = JwtService.decodeAuthHeader(token);
  const unAuthData = { code: "TOKEN_INVALID", message: "Invalid Token" };
  return isTokenValid ? next() : res.status(401).json(unAuthData);
};
