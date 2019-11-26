import HummusRecipe from 'hummus-recipe'
import config from 'config'
import moveFile from 'utils/moveFile'
import removeFile from 'utils/removeFile'

var hummus = require('hummus')

/**
 * get link folder of file hided
 * @param filename
 * @returns {string}
 */
function getOutFileName(filename) {
  let array = filename.split('/')
  return config.pdfHide + '/' + array[array.length - 1]
}

/**
 * get url public file error
 * @param filename
 * @returns {string}
 */
function getUrlPublicErrorFile(filename) {
  return config.publicUrl + '/pdf-error/' + filename
}
/**
 * get file name
 * @param filename
 * @returns {*}
 */
function getFileName(filename) {
  let array = filename.split('/')
  return array[array.length - 1]
}
/**
 * draw shape on pdf file
 * @param filename
 * @param coordinates
 * @returns {Promise.<*>}
 */
async function drawShape(filename, coordinates) {
  if (coordinates.length < 2) {
    await moveFile(filename, config.pdfError + '/' + getFileName(filename))
    let path = getUrlPublicErrorFile(getFileName(filename))
    let success = false
    return {success, path}
  }
  var pdfDoc = new HummusRecipe(filename, getOutFileName(filename))
  const pagesNumber = []
  for (let index = 0; index < coordinates.length; index++) {
    const coordinate = coordinates[index]
    const dataContent = coordinate.content
    if (pagesNumber.indexOf(coordinate.page) === -1) {
      if (pagesNumber.length > 0) {
        pdfDoc.endPage()
      }
      pdfDoc.editPage(coordinate.page)
      pagesNumber.push(coordinate.page)
    }
    pdfDoc
      .rectangle(
        dataContent.x - 5,
        dataContent.y - 10,
        dataContent.width + 30,
        dataContent.height + 5,
        {
          fill: '#3366FF',
          stroke: '#FF6633',
          lineWidth: 4,
          // opacity: 5,
        }
      )
      .text('JobTest.vn', dataContent.x + dataContent.width / 2 - 15, dataContent.y - 7, {
        color: '#EEEEEE',
        fontSize: 10,
        bold: true,
        font: 'Helvatica',
      })
  }
  pdfDoc
    .endPage().endPDF()
  removeFile(filename, (err) => {
    if (err) throw err
    console.log(`successfully deleted ${filename}`);
  })
  let path = getFileName(filename)
  let success = true
  return {success, path}
}

export async function drawShapeOnCV(filename, coordinates) {
  return await drawShape(filename, coordinates)
}
