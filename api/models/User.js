/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const { Sails } = require("sails");
const BcryptService = require("../services/BcryptService");
const empty = require("is-empty");
module.exports = {
  attributes: {
    username: {
      type: "string",
      required: true,
      unique: true,
      minLength: 5,
    },
    password: {
      type: "string",
      required: true,
      minLength: 8,
    },
    name: {
      type: "string",
    },
  },
  tableName: "user",
  beforeCreate: async function (valuesToSet, proceed) {
    try {
      if (empty(valuesToSet.name)) {
        valuesToSet.name = valuesToSet.username;
      }
      // hash password before saving
      let hashedPassword = await BcryptService.hash(valuesToSet.password);
      valuesToSet.password = hashedPassword;
      return proceed();
    } catch (error) {
      sails.log.error(error);
      return proceed(error);
    }
  },
  comparePassword: async function (plainPassword, userData) {
    try {
      return await BcryptService.compare(plainPassword, userData.password);
    } catch (error) {
      console.error(error);
    }
    // return new Promise((resolve, reject) => {
    //   BcryptService.compare(plainPassword, userData.password)
    //     .then((matched) => {
    //       return resolve(matched);
    //     })
    //     .catch((error) => {
    //       return reject(error);
    //     });
    // });
  },
};
