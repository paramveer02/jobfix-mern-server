import multer from "multer";
import { BadRequestError } from "../errors/customErrors.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (ok.includes(file.mimetype)) return cb(null, true);
  cb(new BadRequestError("Only image files (jpg, png, webp, gif) are allowed"));
};

export default multer({
  storage,
  limits: { fileSize: 0.5 * 1024 * 1024 },
  fileFilter,
}).single("avatar");
