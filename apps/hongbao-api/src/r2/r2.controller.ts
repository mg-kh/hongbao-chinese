import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../role/role.decorator';
import { R2Service } from './r2.service';

@ApiTags('Dashboard - R2')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN, Role.TEACHER)
@Controller('dashboard')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.r2Service.uploadImage(file);
  }

  @Post('upload-pdf')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    return this.r2Service.uploadPdf(file);
  }

  @Post('upload-audio')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return this.r2Service.uploadAudio(file);
  }

  @Delete('delete-file')
  deleteFile(@Query('id') key: string) {
    return this.r2Service.deleteFileService(key);
  }
}
