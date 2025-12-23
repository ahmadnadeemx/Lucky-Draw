const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage for member images
const memberImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'members/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }]
  }
});

// Configure Cloudinary storage for voucher images
const voucherImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'members/vouchers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    format: 'jpg'
  }
});

// Create multer instances
const memberImageUpload = multer({ 
  storage: memberImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const voucherImageUpload = multer({ 
  storage: voucherImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to handle multiple file uploads with different storage
const uploadMiddleware = (req, res, next) => {
  // Create a custom storage that routes files to different Cloudinary folders
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const upload = multer({
    storage: multer.memoryStorage(), // Store in memory first
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max per file
      files: 2 // Max 2 files
    }
  }).fields([
    { name: 'memberImage', maxCount: 1 },
    { name: 'feesVoucherImage', maxCount: 1 }
  ]);

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: 'Error uploading files',
        error: err.message
      });
    }

    // Upload files to Cloudinary
    try {
      const uploadPromises = [];
      
      if (req.files.memberImage) {
        const memberImageFile = req.files.memberImage[0];
        uploadPromises.push(
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'members/images',
                transformation: [{ width: 500, height: 500, crop: 'fill' }]
              },
              (error, result) => {
                if (error) reject(error);
                else {
                  req.body.memberImage = result.secure_url;
                  resolve();
                }
              }
            );
            stream.end(memberImageFile.buffer);
          })
        );
      }

      if (req.files.feesVoucherImage) {
        const voucherImageFile = req.files.feesVoucherImage[0];
        uploadPromises.push(
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'members/vouchers'
              },
              (error, result) => {
                if (error) reject(error);
                else {
                  req.body.feesVoucherImage = result.secure_url;
                  resolve();
                }
              }
            );
            stream.end(voucherImageFile.buffer);
          })
        );
      }

      await Promise.all(uploadPromises);
      
      // Parse text fields (they come as strings from FormData)
      if (req.body.serialNo) req.body.serialNo = req.body.serialNo.trim();
      if (req.body.fileNo) req.body.fileNo = req.body.fileNo.trim();
      if (req.body.name) req.body.name = req.body.name.trim();
      if (req.body.fatherName) req.body.fatherName = req.body.fatherName.trim();
      if (req.body.cnic) req.body.cnic = req.body.cnic.trim();
      if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
      if (req.body.mobile) req.body.mobile = req.body.mobile.trim();
      if (req.body.feesVoucherText) req.body.feesVoucherText = req.body.feesVoucherText.trim();
      
      // Convert bmVerification from string to boolean
      if (req.body.bmVerification) {
        req.body.bmVerification = req.body.bmVerification === 'true';
      }
      
      next();
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({
        message: 'Error uploading to Cloudinary',
        error: uploadError.message
      });
    }
  });
};

module.exports = { uploadMiddleware };