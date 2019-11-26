import config from '../config'
import fileHelper from './file_helper'

var sizeOf = require('image-size')
var fs = require('fs')
var pdf2img = require('pdf2img')
PDFDocument = require('pdfkit')
var PDFDocument = require('pdfkit')

export default {
  getFileinFolder(folder) {
    var files = fs.readdirSync(folder)
    var images = []
    for (let i = 0; i < files.length; i++) {
      if (files[i].indexOf('.png') > -1) {
        images.push(files[i])
      }
    }
    return images
  },

  /*
     convert pdf to image
     require graphicsmagick
      -mac os: brew install graphicsmagick
      -ubuntu: sudo apt-get install python-software-properties
               sudo apt-get install software-properties-common
               sudo add-apt-repository ppa:rwky/graphicsmagick
               sudo apt-get update
               sudo apt-get install graphicsmagick
   */
  convertPdf2Image(filename) {
    return new Promise((resolve, reject) => {
      var input = config.pdfHide + '/' + filename
      pdf2img.setOptions({
        type: 'png', // png or jpg, default jpg
        size: 1024, // default 1024
        density: 600, // default 600
        outputdir: config.images, // output folder, default null (if null given, then it will create folder name same as file name)
        outputname: filename.split('.')[0], // output file name, dafault null (if null given, then it will create image name same as input name)
        page: null // convert selected page, default null (if null given, then it will convert all pages)
      })
      pdf2img.convert(input, function (err, info) {
        if (err) {
          reject(err)
        } else {
          resolve(info.message)
        }
      })
    })
  },
  async getSizeOfImage(fileName) {
    const dimensions = await sizeOf(fileName)
    return {
      width: dimensions.width,
      height: dimensions.height
    }
  },
  async createFilePdf(fileImages) {
    let sizeImage = await this.getSizeOfImage(fileImages[0])
    const widthPdf = 612
    const scale = widthPdf/sizeImage.width
    let heightPdf = sizeImage.height * scale
    // new pdf
    var pdf = new PDFDocument({
      size: [widthPdf, heightPdf ], // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
      info: {
        Title: 'CVs - jobtest.vn',
        Author: 'Nguyen Van Tuan'
      }
    })
    let pageLength = fileImages.length
    for (let index = 0; index < pageLength; index++) {
      // let data = await this.getSizeOfImage(fileImages[index])
      // const scale = 612 / data.width
      pdf.image(fileImages[index], 0, 0, {
        scale: scale
      })
      if (index < pageLength - 1) {
        pdf.addPage()
      }
    }
    // Stream contents to a file
    let folders = fileImages[0].split('_')
    let array = folders[0].split('/')
    let name = array[array.length - 1]
    pdf
      .pipe(fs.createWriteStream(fileHelper.getPathOutPdfFile(name)))
      .on('finish', function () {
        console.log('PDF closed')
      })

    // Close PDF and write file.
    pdf.end()
    return name
  }
}
/*
*                          THUAT TOAN CHE MO FILE PDF
*  1. Tien hanh doc file pdf tim cac toa do can che
*  2. Ve shape len cac toa do lay truoc do - xoa file pdf tu pdf-upload
*  3. chuyen doi file pdf vua duoc ve sang dang image
*  4. tao file pdf moi tu cac anh trong folder
*
*  Thu muc chua anh - images
*  Thu muc chua file pdf dc che - pdf-hides
*  Thu muc chua file dc viet moi - pdf-files
* */
