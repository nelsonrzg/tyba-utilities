import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TxtFileService } from '../infrastructure/txt-file.service';
import { parse } from 'csv-parse/sync';
// ...existing code...

@Controller('txt')
export class TxtFileController {
  constructor(private readonly txtFileService: TxtFileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTxtFile(
    @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const csvContent: any[] = await parse(file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      
      relax_column_count: true,
    });
    const totalRecords = await this.txtFileService.processFile(csvContent);
    return { totalRecords };
  }
}
