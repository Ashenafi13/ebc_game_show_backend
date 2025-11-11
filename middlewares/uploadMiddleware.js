const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ValidationError } = require('../utils/errors');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const questionsDir = path.join(uploadsDir, 'questions');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(questionsDir)) {
  fs.mkdirSync(questionsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, questionsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images, audio, and video
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'video/ogg', 'video/quicktime'];
  
  const allowedTypes = [...allowedImageTypes, ...allowedAudioTypes, ...allowedVideoTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`Invalid file type. Only images (JPEG, PNG, GIF, WebP), audio (MP3, WAV, OGG), and video (MP4, WebM, OGG) files are allowed.`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// Middleware to handle single file upload for questions
const uploadQuestionFile = upload.single('file');

// Middleware wrapper to handle multer errors
const handleUploadError = (req, res, next) => {
  uploadQuestionFile(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError('File size too large. Maximum size is 50MB.'));
      }
      return next(new ValidationError(`Upload error: ${err.message}`));
    } else if (err) {
      // An unknown error occurred
      return next(err);
    }
    // Everything went fine, proceed to next middleware
    next();
  });
};

// Middleware to parse JSON from form-data
const parseQuestionData = (req, res, next) => {
  try {
    // If file was uploaded, set the filepath
    if (req.file) {
      req.body.filepath = `/uploads/questions/${req.file.filename}`;
    }
    
    // Parse choices if it's a string (from form-data)
    if (req.body.choices && typeof req.body.choices === 'string') {
      try {
        req.body.choices = JSON.parse(req.body.choices);
      } catch (e) {
        return next(new ValidationError('Invalid choices format. Must be valid JSON array.'));
      }
    }
    
    // Convert numeric fields from strings
    if (req.body.categoryId) req.body.categoryId = parseInt(req.body.categoryId);
    if (req.body.rewardType) req.body.rewardType = parseInt(req.body.rewardType);
    if (req.body.point) req.body.point = parseFloat(req.body.point);
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadQuestionFile: handleUploadError,
  parseQuestionData
};

