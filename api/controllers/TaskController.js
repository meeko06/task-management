/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { Sails } = require("sails");
const empty = require("is-empty");
const moment = require("moment");
const FileUpload = require("../services/FileUpload");
const forms = require("../forms");
const ValidatorService = require("../services/ValidatorService");
module.exports = {
  findTask: async function (req, res) {
    try {
      let result = await Task.getTaskWithAttachments(
        req.query.where ? JSON.parse(req.query.where) : req.query
      );
      return res.json(result);
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },
  findOne: async function (req, res) {
    try {
      const result = await Task.findOne(req.params);
      return res.json(result);
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },
  createTask: async function (req, res) {
    const valuesToSet = req.body;
    try {
      // remove unnecessary fields
      let clean = ValidatorService.clean(valuesToSet, forms.Task);
      // validate fields
      let validation = ValidatorService.validate(clean, forms.Task);
      // check whether there's an error in validation
      if (!empty(validation)) {
        return res.status(400).json({ Errors: validation });
      } else {
        // create a task record
        const result = await Task.create(valuesToSet).fetch();
        // check whether there's a file included
        if (req._fileparser.upstreams.length > 0) {
          const fileResult = await FileUpload.upload(req, res, {
            fileHandle: "file",
            strategy: "local",
          });
          const uploadResult = _.cloneDeep(fileResult);
          uploadResult.files.map((file) => {
            file.task_id = result.id;
          });
          await TaskAttachments.createEach(uploadResult.files);
        }
        return res.json(result);
      }
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  update: async function (req, res) {
    try {
      const valuesToSet = req.body;
      const result = await Task.updateOne({ id: req.params.id }).set(
        valuesToSet
      );
      return res.json(result);
    } catch (error) {
      sails.error(error);
      return res.serverError(error);
    }
  },
  destroy: async function (req, res) {
    try {
      if (empty(req.params.id)) {
        return res
          .status(400)
          .json({ code: "NOT_ALLOWED", message: "Not Allowed" });
      } else {
        let criteria = {
          id: req.params.id,
        };
        const unixMS = moment.now();
        const result = await Task.update(criteria, {
          deletedAt: moment(unixMS).toISOString(),
        }).fetch();
        return res.json({
          code: "SOFT_DELETE",
          message: result,
        });
      }
      // const result = await Task.destroyOne({ id: req.params.id });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
