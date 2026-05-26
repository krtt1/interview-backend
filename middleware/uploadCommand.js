const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===============================
// COMMAND UPLOAD ROOT
// ===============================
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads', 'commands');

// สร้างโฟลเดอร์ถ้ายังไม่มี
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

// อนุญาต extension
const allowedExtensions = [
  '.pdf', '.doc', '.docx',
  '.xls', '.xlsx',
  '.jpg', '.jpeg', '.png',
  '.ppt', '.pptx',
  '.zip'
];

// ขนาดไฟล์สูงสุด
const MAX_SIZE = 15 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_ROOT);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error(`ไม่อนุญาตไฟล์ประเภท ${ext}. อนุญาตเฉพาะ: ${allowedExtensions.join(', ')}`)
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter
});

module.exports = upload;
