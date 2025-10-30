import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}
  async createResume(userId: string, title: string) {
    const resume = await this.prisma.resume.create({
      data: { userId, title },
    });

    return resume;
  }
  async deleteResume(userId: string, resumeId: string) {
    await this.prisma.resume.delete({
      where: {
        userId,
        id: resumeId,
      },
    });
  }
  async getResumeById(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, id: resumeId },
    });

    if (!resume) throw new BadRequestException('Resume not found');

    const {
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...cleanedResume
    } = resume;

    return cleanedResume;
  }
  async getPublicResumeById(resumeId: string) {
    const resume = await this.prisma.resume.findMany({
      where: { public: true, id: resumeId },
    });

    if (!resume) throw new BadRequestException('Resume not found');

    return resume;
  }

  async updateResume(userId: string, resumeId: string, resumeData: any) {
    const updatedResume = await this.prisma.resume.update({
      where: {
        id: resumeId,
        userId: userId,
      },
      data: resumeData,
    });

    return updatedResume;
  }
}
