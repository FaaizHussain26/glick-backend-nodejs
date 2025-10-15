import multer from "multer";
import path from "path";
import fs from "fs/promises";

const uploadPath = "/app/tmp";

export function fileupload(filelocation: string) {
const uploadDir = path.join(uploadPath, `${filelocation}`);

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,  uniqueSuffix + '-' + file.originalname);
  },
});

return multer({ storage });
}




