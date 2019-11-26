import express from 'express'
import config from 'config'
import convertPdf from 'controllers/convertPdf'
import { drawShapeOnCV } from 'controllers/draw-pdf'

var fs = require('fs')

var router = express.Router()

function getPathInput(filename = '') {
  return config.pdfDemo + '/' + filename
}
/**
 * get url public error file
 * @param filename
 * @returns {string}
 */
function getUrlPublicErrorFile(filename) {
  return config.publicUrl + '/pdf-error/' + filename
}

/**
 * get public file hide
 * @param filename
 * @returns {string}
 */
function getUrlPublicFile(filename) {
  return config.publicUrl + '/pdf-hides/' + filename
}

router.get('/coordinates-paint', async (req, res) => {
  try {
    const filename = getPathInput('1516874027-430.pdf')
    let data = await convertPdf.getCoordinates(filename)
    drawShapeOnCV(filename, data)
    res.json(data)
  } catch (err) {
    res.json(err)
  }
})

router.get('/all', async (req, res) => {
  var files = fs.readdirSync(getPathInput())
  try {
    files.forEach(async file => {
      if(file === '.DS_Store' || file === 'README.md') return
      const filename = getPathInput(file)
      let coordinates = await convertPdf.getCoordinates(filename)
      await drawShapeOnCV(filename,coordinates)
    })
    let fileErrors = fs.readdirSync(config.pdfError)
    let fileHides = fs.readdirSync(config.pdfHide)
    let linkPublicFileError = fileErrors.map(file =>{
      return getUrlPublicErrorFile(file)
    })
    let linkPublicFileHide = fileHides.map(file =>{
      return getUrlPublicFile(file)
    })
    let data = {linkPublicFileError, linkPublicFileHide }
    res.json(data)
  }
  catch (e){
    console.log(e)
  }


})
export default router
//235 165 852 434 169 453
// 639
//che link skype
// test 2 : 379 235 564 434