import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage (used as staging area)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^\w-]/g, '_');
    cb(null, `${cleanBaseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB limit per file
  fileFilter(req, file, cb) {
    // Enable all kinds of files (SolidWorks, CAD, 3D models, docs, images, archives, etc.)
    cb(null, true);
  },
});

const router = express.Router();

/**
 * Uploads a file to Cloudinary if configured; otherwise retains local disk file.
 */
async function processUploadedFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let fileType = 'document';

  const cadExts = [
    '.stl', '.obj', '.gltf', '.glb', '.step', '.stp',
    '.sldprt', '.sldasm', '.slddrw', '.prt', '.asm', '.drw',
    '.igs', '.iges', '.x_t', '.x_b', '.sat', '.dwg', '.dxf',
    '.fbx', '.dae', '.3ds', '.blend', '.catpart', '.catproduct',
    '.ipt', '.iam', '.f3d'
  ];
  const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp', '.tiff'];

  if (cadExts.includes(ext)) {
    fileType = '3d-model';
  } else if (imageExts.includes(ext)) {
    fileType = 'image';
  }

  // Cloudinary storage if environment variables are set
  if (isCloudinaryConfigured()) {
    try {
      const isImage = fileType === 'image';
      const cleanBaseName = path.basename(file.originalname, ext).replace(/[^\w-]/g, '_');

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'aau-biomedical-studio',
        resource_type: isImage ? 'image' : 'raw',
        public_id: `${cleanBaseName}-${Date.now()}${ext}`,
        use_filename: true,
      });

      // Cleanup local temp staging file
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (_) {}
      }

      return {
        url: result.secure_url,
        fileName: result.public_id,
        originalName: file.originalname,
        fileType,
        size: file.size,
        provider: 'cloudinary',
      };
    } catch (err) {
      console.error('[Cloudinary Upload Error, falling back to local]', err.message);
      // Fall through to local fallback
    }
  }

  // Local disk fallback
  return {
    url: `/uploads/${file.filename}`,
    fileName: file.filename,
    originalName: file.originalname,
    fileType,
    size: file.size,
    provider: 'local',
  };
}

// @route POST /api/upload
// @desc  Upload single file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileInfo = await processUploadedFile(req.file);
    res.json(fileInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/upload/multiple
router.post('/multiple', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploaded = await Promise.all(
      req.files.map((file) => processUploadedFile(file))
    );

    res.json(uploaded);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
