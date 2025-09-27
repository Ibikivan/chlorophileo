import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PlantService } from './plant.service';
import { Plant } from './plant.model';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async create(
    @Req() req: any,
    @Body() body: Partial<Plant>,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Plant> {
    const userId: string = req.user.sub;
    if (file) {
      body.imageUrl = `/files/${file.filename}`;
    }
    return await this.plantService.create(userId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('imageUrl', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<Plant>,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<void> {
    const userId: string = req.user.sub;
    if (file) {
      body.imageUrl = `/files/${file.filename}`;
    }
    await this.plantService.update(userId, id, body);
  }

  @Get('/:id')
  async findOne(@Req() req: any, @Param('id') id: string): Promise<Plant | null> {
    const userId: string = req.user.sub
    return await this.plantService.findOne(userId, id)
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const userId: string = req.user.sub
    return await this.plantService.findAll(userId, page, limit)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async remove(@Req() req: any, @Param('id') id: string): Promise<void> {
    const userId: string = req.user.sub
    await this.plantService.remove(userId, id)
  }
}
