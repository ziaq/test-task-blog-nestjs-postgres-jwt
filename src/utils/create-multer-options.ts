import { diskStorage, Options } from 'multer';
import { join, extname, basename } from 'path';
import * as fs from 'fs';

export function createMulterOptions(folder: string): Options {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const uploadPath = join(process.cwd(), 'uploads', folder);
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
          console.log(`📁 Created folder: ${uploadPath}`);
        }
        cb(null, uploadPath);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        const name = basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      },
    }),
  };
}