const multer = require('multer');
import config from 'config'

function getFileType(fileName) {
  const strs = fileName.split(".");
  return strs[strs.length - 1];
}

function cleanOriginalName(fileName) {
  const strs = fileName.split(".");
  return strs[0];
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.pdfUpload),
  filename: (req, file, cb) => {
    cb(null, `${cleanOriginalName(file.originalname)}.${getFileType(file.originalname)}`)
    // cb(null, 'tuancam.pdf')
  }
});

const limits = { fileSize: 102400 };

function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/png') return cb(null, true);
  cb(new Error('Loi dinh dang'));
}

const upload = multer({ storage });
export default upload
