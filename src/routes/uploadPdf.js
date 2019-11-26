import express from 'express'
import config from 'config'
import multer from 'utils/multer'
import convertPdf from 'controllers/convertPdf'
import { drawShapeOnCV } from 'controllers/draw-pdf'
import commonHelper from 'utils/common_helper'
import removeFile from 'utils/removeFile'

var fs = require('fs')
// var upload = multer({ dest: 'pdf-error/' })
var router = express.Router()

function getUrlPublicFile(filename) {
  return config.publicUrl + '/pdf-files/' + filename + '.pdf'
}
function removeAllFileInFolder(folder) {
  var files = fs.readdirSync(folder)
  files.map(file => {
    if (file !== '.DS_Store') {
      removeFile(folder + '/' + file, err => {
        if (err) throw err
        console.log(`successfully deleted ${file}`)
      })
    }
  })
}

router.post('/', multer.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path
    let coordinates = await convertPdf.getCoordinates(filePath)
    let data = await drawShapeOnCV(filePath, coordinates)
    if (data.success === false) {
      res.json({
        success: false,
        message: 'input file is error',
        path: data.path
      })
    } else {
      //neu file ve drawshape thanh cong thi se toi chuyen doi pdf sang image(.png)
      let fileName = data.path
      const fileImages = await commonHelper.convertPdf2Image(fileName)
      let nameFilePdf = await commonHelper.createFilePdf(
        fileImages.map(image => image.path)
      )
      //xoa pdf-hides
      removeAllFileInFolder(config.pdfHide)
      //xoa images
      removeAllFileInFolder(config.images)
      res.json({
        success: true,
        message: 'success - convert file pdf',
        path: getUrlPublicFile(nameFilePdf)
      })
      // res.redirect(getUrlPublicFile(nameFilePdf))
    }
  } catch (err) {
    res.json(err)
  }
})
//
// router.post('/pdf', multer.single('file'), async (req, res) => {
//   try {
//     const filePath = req.file.path
//     let coordinates = await convertPdf.getCoordinates(filePath)
//     let data = await drawShapeOnCV(filePath, coordinates)
//     res.json(data)
//   }catch(e){
//     res.json({success: false, error: e.message})
//   }
// })

export default router
