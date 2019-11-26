const moveFile = require('move-file');

export default async function move(movedFile,intoFile) {
  await moveFile(movedFile, intoFile)
}
