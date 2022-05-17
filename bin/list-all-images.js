const fs = require("fs");
const glob = require("glob");
const sizeOf = require('image-size')


const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];


const getImageDimension = (path) => {
  return sizeOf(path);
};

function getFileInfoByPath(filePath) {
  const fileName = filePath.split("/").pop();
  const size = fs.statSync(filePath).size;
  const modifyDate = fs.statSync(filePath).mtime;
  const sizeSummary =
    size > 1024 ? `${(size / 1024).toFixed(2)} KB` : `${size} B`;
  return {
    fileName,
    filePath,
    size,
    modifyDate,
    sizeSummary,
    ...getImageDimension(filePath),
  };
}

const removePrefixOfPath = (prefix, path) => {
  return path.replace(prefix, "");
};

function listAllImages(folderPath) {
  return new Promise((resolve, reject) => {
    const extension = `${folderPath}/**/*.{${imageExtensions.join(",")}}`;
    glob(
      extension,
      {
        // ignore node_modules
        ignore: ["node_modules/**/*"]
      },
      (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.map(getFileInfoByPath).map(item=>{
            return {
              ...item,
              shortPath: removePrefixOfPath(folderPath, item.filePath),
            }
          }));
        }
      }
    );
  });
}

exports.listAllImages = listAllImages;
