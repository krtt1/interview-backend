const multer = require('multer');
const path = require('path');
const fs = require('fs');

// โฟลเดอร์เก็บไฟล์
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads', 'meetings');

// สร้างโฟลเดอร์ถ้ายังไม่มี
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

// อนุญาต extension ที่ต้องการ
const allowedExtensions = [
  '.pdf', '.doc', '.docx',
  '.xls', '.xlsx',
  '.jpg', '.jpeg', '.png',
  '.ppt', '.pptx',
  '.zip'
];

// ข้อจำกัดขนาดไฟล์ (bytes)
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
    return cb(new Error(`ไม่อนุญาตไฟล์ประเภท ${ext}. อนุญาตเฉพาะ: ${allowedExtensions.join(', ')}`));
  }

  // เพิ่มตรวจ mime type เบื้องต้น (optional)
  // ถ้าต้องการตรวจ mime เพิ่มเติม ให้ใส่เงื่อนไขที่นี่

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter
});

module.exports = upload;
