/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  "*": "is-logged-in", // Everything resctricted here
  // Bypass the `is-logged-in` policy for:
  // task: true,
  // "*": ["isAuthorized"],
  AuthV2Controller: {
    login: true,
  },
  User: {
    create: true,
  },
};
