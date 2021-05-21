/**
 * TaskAttachments.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    task_id: {
      type: "string",
      allowNull: false,
    },
    filename: {
      type: "string",
      columnType: "text",
      allowNull: false,
    },
    file_uuid: {
      type: "string",
      columnType: "text",
      allowNull: false,
    },
    size: {
      type: "number",
      columnType: "bigint",
    },
    type: {
      type: "string",
    },
    fd: {
      type: "string",
      // Sails requires a size for TEXT columnType.
      // columnType: 'text',
      unique: true,
      required: true,
      allowNull: false,
    },
    // tableName: "taskattachments",
  },
};
