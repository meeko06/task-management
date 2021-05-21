module.exports = {
  repro: function (req, res) {
    function test() {
      return new Promise((resolve, reject) => {
        resolve({ a: "v" });
      });
    }
    Projects.createEach([]).then(function (d) {
      return res.json({ a: "v" });
    });
  },

  upload: function (req, res) {
    // Other body parameters should appear before any file fields.
    FileUpload.upload(req, res, {
      fileHandle: "file",
      strategy: "local",
    })
      .then(function (result) {
        const uploadResult = _.cloneDeep(result);
        FileMeta.createEach(result.files).then(function (d) {
          return res.json(uploadResult);
        });
      })
      .catch(function (error) {
        if (error.code === 422) {
          return res.status(422).json(error.error);
        } else {
          sails.log.error(error);
          return res.status(500).json(error);
        }
      });
  },
};
