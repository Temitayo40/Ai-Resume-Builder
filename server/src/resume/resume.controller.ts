import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PersonalInfo } from '@prisma/client';
import { AuthRequest } from 'src/auth/express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { ResumeService } from './resume.service';

@Controller('api/resumes')
export class ResumeController {
  constructor(
    private resumeService: ResumeService,
    private readonly imagekitService: ImagekitService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createResume(@Body() body: { title: string }, @Req() req: AuthRequest) {
    const userId = req.userId as string;
    const { title } = body;
    try {
      const newResume = await this.resumeService.createResume(userId, title);
      return { message: 'Resume Created Successfully', resume: newResume };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred creating resumes',
      );
    }
  }

  @Get('get/:resumeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getResumeById(
    @Param('resumeId') resumeId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.userId as string;
    try {
      const resume = await this.resumeService.getResumeById(userId, resumeId);

      return { resume };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('public/:resumeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getPublicResume(@Param('resumeId') resumeId: string) {
    try {
      const resume = await this.resumeService.getPublicResumeById(resumeId);

      return { resume };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred getting public resumes',
      );
    }
  }

  @Patch('update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateResume(
    @Req() req: AuthRequest,
    @Body()
    body: {
      resumeId: string;
      resumeData: PersonalInfo;
      removeBackground: boolean;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.userId as string;
    const { resumeId, resumeData, removeBackground } = body;
    const resumeDataCopy = { ...resumeData };
    try {
      if (file) {
        const response = await this.imagekitService.uploadFile(
          file,
          removeBackground,
        );
        const { url } = response;
        resumeDataCopy.image = url;
      }
      const resume = await this.resumeService.updateResume(
        userId,
        resumeId,
        resumeDataCopy,
      );

      return { resume };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred updating resumes',
      );
    }
  }

  @Delete('delete/:resumeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async deleteResume(
    @Param('resumeId') resumeId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.userId as string;

    try {
      await this.resumeService.deleteResume(userId, resumeId);
      return { message: 'Resume Deletes Successfully' };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred deleting resumes',
      );
    }
  }
}
