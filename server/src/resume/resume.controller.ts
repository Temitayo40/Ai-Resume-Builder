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
import { PrismaService } from 'src/database/prisma.service';
import * as multer from 'multer';

@Controller('api/resumes')
export class ResumeController {
  constructor(
    private resumeService: ResumeService,
    private readonly imagekitService: ImagekitService,
    private prisma: PrismaService,
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

  @Get('/get/:resumeId')
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

  @Get('/public/:resumeId')
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

  // @Patch('update')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // async updateResume(
  //   @Req() req: AuthRequest,
  //   @Body()
  //   body: {
  //     resumeId: string;
  //     resumeData: PersonalInfo;
  //     removeBackground: boolean;
  //   },
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const userId = req.userId as string;
  //   const { resumeId, resumeData, removeBackground } = body;

  //   let resumeDataCopy;
  //   if (typeof resumeData === 'string') {
  //     resumeDataCopy = await JSON.parse(resumeData);
  //   } else {
  //     resumeDataCopy = structuredClone(resumeData);
  //   }
  //   try {
  //     if (file) {
  //       const response = await this.imagekitService.uploadFile(
  //         file,
  //         removeBackground,
  //       );
  //       const { url } = response;
  //       resumeDataCopy.imag = url;
  //     }
  //     const resume = await this.resumeService.updateResume(
  //       userId,
  //       resumeId,
  //       resumeDataCopy,
  //     );

  //     return {
  //       message: 'Resume Updated Successfully',
  //       resume,
  //     };
  //   } catch (error: any) {
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw new BadRequestException(
  //       'An unexpected error occurred updating resumes',
  //     );
  //   }
  // }

  @Patch('update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
    }),
  )
  async updateResume(
    @Req() req: AuthRequest,
    @Body()
    body: {
      resumeId: string;
      resumeData: any;
      removeBackground: boolean;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.userId as string;
    const { resumeId, resumeData, removeBackground } = body;

    // Parse resumeData if it came as a string
    let parsedResumeData: any;
    if (typeof resumeData === 'string') {
      parsedResumeData = JSON.parse(resumeData);
    } else {
      parsedResumeData = structuredClone(resumeData);
    }

    // 1️⃣ Handle image upload if exists
    if (file && parsedResumeData.personal_info) {
      const uploadResult = await this.imagekitService.uploadFile(
        file,
        removeBackground,
      );
      parsedResumeData.personal_info.image = uploadResult.url;
    }

    // 2️⃣ Fetch the resume to verify ownership
    const existingResume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!existingResume || existingResume.userId !== userId) {
      throw new BadRequestException('Resume not found or unauthorized');
    }

    // 3️⃣ Update Resume core fields
    const updatedResume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        title: parsedResumeData.title,
        public: parsedResumeData.public,
        template: parsedResumeData.template,
        accent_color: parsedResumeData.accent_color,
        professional_summary: parsedResumeData.professional_summary,
        skills: parsedResumeData.skills,
      },
    });

    // 4️⃣ Upsert PersonalInfo
    if (parsedResumeData.personal_info) {
      await this.prisma.personalInfo.upsert({
        where: { resumeId },
        update: {
          ...parsedResumeData.personal_info,
        },
        create: {
          resumeId,
          ...parsedResumeData.personal_info,
        },
      });
    }

    // 5️⃣ Update Experience
    if (parsedResumeData.experience?.length) {
      await this.prisma.experience.deleteMany({ where: { resumeId } });
      await this.prisma.experience.createMany({
        data: parsedResumeData.experience.map((exp) => ({
          ...exp,
          resumeId,
        })),
      });
    }

    // 6️⃣ Update Projects
    if (parsedResumeData.projects?.length) {
      await this.prisma.project.deleteMany({ where: { resumeId } });
      await this.prisma.project.createMany({
        data: parsedResumeData.projects.map((proj) => ({
          ...proj,
          resumeId,
        })),
      });
    }

    // 7️⃣ Update Education
    if (parsedResumeData.education?.length) {
      await this.prisma.education.deleteMany({ where: { resumeId } });
      await this.prisma.education.createMany({
        data: parsedResumeData.education.map((edu) => ({
          ...edu,
          resumeId,
        })),
      });
    }

    // 8️⃣ Return full updated resume
    const fullResume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        personal_info: true,
        experience: true,
        projects: true,
        education: true,
      },
    });

    return { message: 'Resume updated successfully', resume: fullResume };
  }

  @Delete('/delete/:resumeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async deleteResume(
    @Param('resumeId') resumeId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.userId as string;

    try {
      await this.resumeService.deleteResume(userId, resumeId);
      return { message: 'Resume Deleted Successfully' };
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
