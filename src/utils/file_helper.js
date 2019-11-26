const moveFile = require('move-file');
import config from '../config'
export default {
  async move(movedFile,intoFile) {
    await moveFile(movedFile, intoFile)
  },
  getFileName(file) {
    let array = file.split('_')
    return array[0]
  },
  getPathImageFile(fileName){
    return config.images + '/' + fileName
  },
  getPathOutPdfFile(fileName) {
    return config.newPdf + '/' + fileName + '.pdf'
  }
}

