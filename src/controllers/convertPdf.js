var PDFExtract = require('pdf.js-extract').PDFExtract
var pdfExtract = new PDFExtract()
const urlRegex = require('url-regex');

let regexPhone = /(09|01[2|6|8|9])+([0-9]{8})\b/g

export default {
  /**
   * Get Pdf File
   * @param filename
   * @returns {Promise}
   */
  getInfoPdfFile(filename) {
    return new Promise((resolve, reject) => {
      pdfExtract.extract(
        filename,
        {} /* options, currently nothing available*/,
        function (err, data) {
          if (err) return reject(err)
          resolve(data)
        }
      )
    })
  },

  /**
   * Get content by x,y
   * @param data
   */
  getContent(data) {
    let pages = data.map(page => {
      let numberPage = page.pageInfo.num
      let contents = page.content
      let objStr = contents.map(item => {
        let x = item.x
        let y = item.y
        let width = item.width
        let height = item.height
        let str = item.str
        return {x, y, width, height, str}
      })
      return {numberPage, objStr}
    })
    return pages
  },

  /**
   * Kiểm tra pdf
   * @param str
   * @returns {boolean}
   */
  checkEmail(str) {
    let char = '@'
    let isExist = str.indexOf(char)
    return isExist > -1
  },
  /**
   *  get true of false
   * @param str
   */
  checkYear(str) {
    if (str.indexOf('/') > -1 || str.indexOf('-') > -1) {
      return true
    }
    let tmpYear = 1980
    for (let i = 0; i < 100; i++) {
      if (str.indexOf(tmpYear.toString()) > -1) {
        return true
      }
      tmpYear++
    }
    return false
  },
  /**
   * kiem tra chuoi dua vao co phai la so dien thoai k
   * neu chuoi dua vao co dang la nam
   * @param str
   * @returns {boolean}
   */
  checkFirstNumber(str) {
    let isYear = this.checkYear(str)
    if (isYear) {
      return false
    }
    let regex = /(09|01[2|6|8|9])+([0-9]{0})\b/g
    let isFirstPhone = str.match(regex)
    if (isFirstPhone) {
      return true
    }
    let regexOne = /(09|01[2|6|8|9])+([0-9]{1})\b/g
    let isFirstPhoneOne = str.match(regexOne)
    if (isFirstPhoneOne) {
      return true
    }
    let regexTwo = /(09|01[2|6|8|9])+([0-9]{2})\b/g
    let isFirstPhoneTwo = str.match(regexTwo)
    if (isFirstPhoneTwo) {
      return true
    }
    let regexThree = /(09|01[2|6|8|9])+([0-9]{3})\b/g
    let isFirstPhoneThree = str.match(regexThree)
    if (isFirstPhoneThree) {
      return true
    }
    let regexFour = /(09|01[2|6|8|9])+([0-9]{4})\b/g
    let isFirstPhoneFour = str.match(regexFour)
    if (isFirstPhoneFour) {
      return true
    }
    let regexFive = /(09|01[2|6|8|9])+([0-9]{5})\b/g
    let isFirstPhoneFive = str.match(regexFive)
    if (isFirstPhoneFive) {
      return true
    }
    let regexSix = /(09|01[2|6|8|9])+([0-9]{6})\b/g
    let isFirstPhoneSix = str.match(regexSix)
    if (isFirstPhoneSix) {
      return true
    }
    let regexSeven = /(09|01[2|6|8|9])+([0-9]{7})\b/g
    let isFirstPhoneSeven = str.match(regexSeven)
    if (isFirstPhoneSeven) {
      return true
    }
    return false
  },
  checkSkype(str) {
    let lowerCaseName = str.toLowerCase();
    if(lowerCaseName.indexOf('skype') > -1) {
      return true
    }
    return false
  }
  ,
  /**
   * Phone và email
   * @param listContent
   * @returns {Array}
   */
  getCoordinatePhoneAndEmail(listContent) {
    let coordinates = []
    listContent.forEach(item => {
      let contents = item.objStr
      contents.forEach(content => {
        //check url
        let url = urlRegex().test(content.str)
        //check link fb
        let isPhp = content.str.indexOf('.php') > -1
        // check +84 for phone code vietnam
        let phoneCode = content.str.indexOf('+84') > -1
        // replace . - space
        let str = content.str.replace(/(\.|-|\s|)/g, '')
        // check first number phone
        let firstNumber = this.checkFirstNumber(str)
        // get phone number
        let phone = str.match(regexPhone)
        // regex link skype
        let email = this.checkEmail(str)
        let skype = this.checkSkype(str)
        if (phone || email || url || isPhp || phoneCode || firstNumber || skype) {
          let page = item.numberPage
          if (str.length < 10 && str.indexOf('@') > -1) {
            content.x -= 40
            content.y -= 10
            content.width += 60
            content.height += 10
          }
          if (str.length < 5 && (phoneCode || firstNumber)) {
            content.width += 50
          }
          if(skype) {
            content.x += 40
            content.y -= 10
            content.width += 60
            content.height += 10
          }
          let data = {page, content}
          coordinates.push(data)
        }
      })
    })
    return coordinates
  },

  /**
   * Lấy tọa độ
   * @param filename
   * @returns {Promise.<*>}
   */
  async getCoordinates(filename) {
    let data = await this.getInfoPdfFile(filename)
    let listContent = this.getContent(data.pages)
    return this.getCoordinatePhoneAndEmail(listContent)
  }

}
/*
  BỊ LỖI Ở NHỮNG FILE
  1. Đọc từng chữ
  2. không đọc được từ file ảnh chuyển sang pdf
  -- che link mail
 */



