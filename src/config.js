import path from 'path'

export default {
  port: 1901,
  domain: 'https://auth-api.tungtung.vn',
  api: 'https://quiz-api.tungtung.vn',
  public: '../public',
  publicUrl: 'http://localhost:1901',
  newPdf: path.join(__dirname, '../public/pdf-files'),
  images: path.join(__dirname, '../public/images'),
  pdfUpload: path.join(__dirname, '../public/pdf-uploads'),
  pdfHide: path.join(__dirname, '../public/pdf-hides'),
  pdfError: path.join(__dirname, '../public/pdf-error'),
}
