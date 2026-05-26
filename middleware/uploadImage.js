const multer = require('multer');
const path = require('path');
const fs = require('fs');

// สร้างโฟลเดอร์ถ้ายังไม่มี
const uploadDir = 'uploads/profiles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ใช้ user id เป็นชื่อไฟล์เพื่อไม่ให้ซ้ำ
    const userId = req.user?.id || 'unknown';
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, `${userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพ (.jpg, .jpeg, .png, .gif, .webp) เท่านั้น'), false);
  }
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = uploadImage;
