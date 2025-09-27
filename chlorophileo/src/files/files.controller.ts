import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('files')
export class FilesController {
  @Get(':filename')
  async serveFile(@Param('filename') filename: string, @Res() res) {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    return res.sendFile(filePath);
  }
}
