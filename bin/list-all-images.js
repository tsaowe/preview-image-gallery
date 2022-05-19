const fs = require("fs");
const glob = require("glob");
const path = require("path");
const sizeOf = require('image-size')


const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
const imageWithNoSize = ["svg"];


const getImageDimension = (path) => {
  const extension = path.split(".").pop();
  const lowerCasedExtension = extension.toLowerCase();
  if (imageWithNoSize.includes(lowerCasedExtension)) {
    return {
      width: 'svg',
      height: 'svg'
    };
  }
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

const absolutePath = (filePath)=>{
  if(filePath.startsWith("/")){
    return filePath;
  }
  return `${process.cwd()}/${filePath}`;
}

function listAllImages(folderPath) {
  if(!folderPath.startsWith("/")){
    folderPath = path.resolve(folderPath);
  }
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
            const absPath = absolutePath(item.filePath)
            return {
              ...item,
              filePath: absPath,
              shortPath: removePrefixOfPath(folderPath, absPath),
            }
          }));
        }
      }
    );
  });
}

exports.listAllImages = listAllImages;
