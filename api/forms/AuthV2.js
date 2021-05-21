module.exports = {
  fields: {
    username: {
      required: true,
      minLength: 5,
    },
    password: {
      required: true,
      minLength: 8,
    },
  },
  name: "AuthV2",
};
