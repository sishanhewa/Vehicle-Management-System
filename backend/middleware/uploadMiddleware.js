const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the public/uploads directory exists so Multer doesn't crash
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Local Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    // Generates unique filename using timestamp
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Helper to filter for only Image files
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only images (jpg, jpeg, png) are allowed!');
  }
}

// Initialize upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB Limit per image
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
