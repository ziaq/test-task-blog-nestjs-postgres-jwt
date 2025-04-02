import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
const fileType = require('file-type');
import { randomBytes } from 'crypto';
import { join, extname } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ImageValidationAndStoragePipe implements PipeTransform {
  private readonly ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly folder: string) {}

  async transform<T extends Express.Multer.File | Express.Multer.File[]>(
    input: T
  ): Promise<T | undefined> {
    if (!input || (Array.isArray(input) && input.length === 0)) {
      return undefined;
    }
  
    if (Array.isArray(input)) {
      const result = await Promise.all(input.map((file) => this.validateAndSave(file)));
      return result as T;
    }
  
    const result = await this.validateAndSave(input);
    return result as T;
  }
  

  private async validateAndSave(file: Express.Multer.File): Promise<Express.Multer.File> {
    // Type check by magic numbers
    const detectedType = await fileType.fromBuffer(file.buffer);
    if (!detectedType || !this.ALLOWED_MIME.includes(detectedType.mime)) {
      throw new BadRequestException('Invalid file type. Only jpg, png, and webp are allowed');
    }

    const filename = this.generateFilename(file.originalname);
    const folderPath = join(process.cwd(), 'uploads', this.folder);
    const fullPath = join(folderPath, filename);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    file.filename = filename;
    file.path = fullPath;
    file.mimetype = detectedType.mime;

    return file;
  }

  private generateFilename(originalname: string): string {
    const ext = extname(originalname);
    const random = randomBytes(8).toString('hex');
    const timestamp = Date.now();
    return `${this.folder}-${random}-${timestamp}${ext}`;
  }
}