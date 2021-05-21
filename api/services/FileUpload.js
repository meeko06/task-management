const path = require("path");
const _ = require("lodash");

module.exports = {
  upload: function (
    req,
    res,
    { fileHandle, pathToDisk, baseUrl = "", strategy = "local" }
  ) {
    return new Promise((resolve, reject) => {
      if (!fileHandle) {
        sails.log.error("[FileUpload] Undefined `fileHandle`.");
        return reject({
          error: {
            message: `Undefined 'fileHandle'`,
          },
        });
      }
      // MinioClient.putObject(req, res, { bucket: 'chum' })
      let uploadOptions = function () {
        switch (strategy) {
          case "minio":
            return {
              adapter: require("skipper-better-s3"),
              s3config: {
                s3ForcePathStyle: true,
                sslEnabled: false,
                signatureVersion: "v4",
                endpoint: "192.168.99.100:9000",
              },
              key: "minio",
              secret: "minio123",
              bucket: "chum",
              dirname: pathToDisk ? pathToDisk : null,
            };
          default:
            return {
              dirname: pathToDisk
                ? path.resolve(pathToDisk)
                : path.resolve(sails.config.appPath, "assets/uploads"),
            };
        }
      };
      req.file(fileHandle).upload(
        {
          ...uploadOptions(),
          ...{
            // 30MB
            maxBytes: sails.config.custom.upload.maxBytes || 30000000,
          },
        },
        function (error, uploadedFiles) {
          if (error) {
            sails.log.error("[FileUpload] Unexpected error", error);
            return reject(error);
          }

          if (uploadedFiles.length === 0) {
            sails.log.debug("[FileUpload] No file was uploaded.");
            return reject({
              code: 422,
              error: { message: "No file was uploaded." },
            });
          }

          const files = _.map(uploadedFiles, function (e) {
            e["file_uuid"] = require("util").format("%s", path.basename(e.fd));
            return e;
          });
          return resolve(
            _.cloneDeep({
              files: files,
              message: uploadedFiles.length + " files(s) uploaded successfully",
            })
          );
        }
      );
    });
  },

  streamFile: function (fileId, pathToDisk) {
    var SkipperDisk = require("skipper-disk");
    var fileAdapter = SkipperDisk(/* optional opts */);

    const location = pathToDisk
      ? path.resolve(pathToDisk, fileId)
      : path.resolve(sails.config.appPath, "assets/uploads", fileId);
    // Stream the file down
    return fileAdapter.read(location);
  },
};
