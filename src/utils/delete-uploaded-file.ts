import { join } from 'path';
import * as fs from 'fs';

export function deleteUploadedFile(folder: string, filename: string): void {
  const filePath = join(process.cwd(), 'uploads', folder, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}