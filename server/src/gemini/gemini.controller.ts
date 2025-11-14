import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { AuthRequest } from 'src/auth/express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}
  @Post('enhance-pro-sum')
  @UseGuards(JwtAuthGuard)
  async enhanceProfessionalSummary(@Body() body: { userContent: string }) {
    const { userContent } = body;
    if (!userContent) throw new BadRequestException('Missing required fields');

    try {
      const enhancedContent =
        await this.geminiService.professionalSummary(userContent);
      return { enhancedContent };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error: cannot generate Ai summary',
      );
    }
  }

  @Post('enhance-job-desc')
  @UseGuards(JwtAuthGuard)
  async enhanceJobDescription(@Body() body: { userContent: string }) {
    const { userContent } = body;
    if (!userContent) throw new BadRequestException('Missing required fields');

    try {
      const enhancedContent =
        await this.geminiService.jobDescription(userContent);
      return { enhancedContent };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error: cannot generate job description',
      );
    }
  }

  @Post('upload-resume')
  @UseGuards(JwtAuthGuard)
  async enhanceUploadResume(
    @Body() body: { resumeText: string; title: string },
    @Req() req: AuthRequest,
  ) {
    const { resumeText, title } = body;
    const userId = req.userId as string;

    if (!resumeText) throw new BadRequestException('Missing required fields');

    try {
      const enhancedContent = await this.geminiService.uploadResume(
        userId,
        resumeText,
        title,
      );
      return { enhancedContent };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error: cannot generate job description',
      );
    }
  }
}
