import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';

const ALLOWED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const ALLOWED_PDF_MIME_TYPES = ['application/pdf'];

const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
];

@Injectable()
export class R2Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('R2_BUCKET_NAME');
    this.publicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');
    this.client = new S3Client({
      region: 'auto',
      endpoint: this.configService.getOrThrow<string>('R2_S3_API_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('R2_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'R2_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadImage(file: Express.Multer.File) {
    return withErrorHandling(async () => {
      if (!file) {
        throw new BadRequestException('Image file is required');
      }

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Only image files are allowed');
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const ext = file.mimetype.split('/')[1]; // e.g. 'jpeg', 'png'
      const key = `images/${year}/${month}/${randomUUID()}.${ext}`;

      await this.uploadFile(key, file.buffer, file.mimetype);

      return successResponse({
        data: { id: key, url: `${this.publicUrl}/${key}` },
      });
    });
  }

  async uploadPdf(file: Express.Multer.File) {
    return withErrorHandling(async () => {
      if (!file) {
        throw new BadRequestException('PDF file is required');
      }

      if (!ALLOWED_PDF_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Only PDF files are allowed');
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const key = `pdfs/${year}/${month}/${randomUUID()}.pdf`;

      await this.uploadFile(key, file.buffer, file.mimetype);

      return successResponse({
        data: { id: key, url: `${this.publicUrl}/${key}` },
      });
    });
  }

  async uploadAudio(file: Express.Multer.File) {
    return withErrorHandling(async () => {
      if (!file) {
        throw new BadRequestException('Audio file is required');
      }

      if (!ALLOWED_AUDIO_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('Only audio files are allowed');
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const ext = file.mimetype.split('/')[1];
      const key = `audios/${year}/${month}/${randomUUID()}.${ext}`;

      await this.uploadFile(key, file.buffer, file.mimetype);

      return successResponse({
        data: { id: key, url: `${this.publicUrl}/${key}` },
      });
    });
  }

  async deleteFileService(key: string) {
    return withErrorHandling(async () => {
      if (!key) {
        throw new BadRequestException('Image key is required');
      }

      await this.deleteFile(key);

      return successResponse({
        data: { key },
      });
    });
  }

  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ) {
    return await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getFile(key: string) {
    return await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async deleteFile(key: string) {
    return await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async listFiles(prefix?: string) {
    return await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );
  }
}
