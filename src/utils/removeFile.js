var fs = require('fs');

export default function removeFile(filePath,callback) {
  fs.unlink(filePath, callback);
}
