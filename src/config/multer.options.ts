import { memoryStorage, Options } from 'multer';

export const multerOptions: Options = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};
