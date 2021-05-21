/**
 * Task.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    task: {
      type: "string",
    },
    task_details: {
      type: "string",
    },
  },
  tableName: "task",
  getTaskWithAttachments: async function (req) {
    // fetch all task
    let result = await Task.find(req);
    // fetch all attachments
    let attachmentsList = await TaskAttachments.find(req);
    // Combine each task to its attachments
    result.map((task) => {
      // filtered all task attachments
      task.files = attachmentsList.filter((attachment) => {
        return attachment.task_id == task.id;
      });
      // format the attachment name and blob
      task.files = task.files.map((file) => {
        file.blob = `${sails.config.custom.uploads}${file.fd
          .split("\\")
          .pop()}`;
        file.name = file.filename;
        return _.pick(file, ["blob", "name"]);
      });
      return task;
    });
    return result;
  },
};
