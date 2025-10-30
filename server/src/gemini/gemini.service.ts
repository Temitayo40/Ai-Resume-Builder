import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GeminiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
      baseURL: this.configService.get<string>('GEMINI_BASE_URL'),
    });
  }

  async professionalSummary(userContent: string) {
    const response = await this.openai.chat.completions.create({
      model: this.configService.get<string>('GEMINI_MODEL')!,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.',
        },
        { role: 'user', content: userContent },
      ],
    });
    return response.choices[0].message?.content;
  }
  async jobDescription(userContent: string) {
    const response = await this.openai.chat.completions.create({
      model: this.configService.get<string>('GEMINI_MODEL')!,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.',
        },
        { role: 'user', content: userContent },
      ],
    });
    return response.choices[0].message?.content;
  }
  async uploadResume(userId: string, resumeText: string, title: string) {
    const systemPrompt =
      'You are an expert AI Agent to extract data from resume';

    const userPrompst = `extract data from this resume: ${resumeText} 
      Provide data in the following JSON format with no additional text before or after:
      
      {
       professional_summary: { type: String, default: "" },
       skills: [{ type: String }],

        personal_info: {
        image: { type: String, default: "" },
        full_name: { type: String, default: "" },
        profession: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
        },

        experience: [
        {
            company: { type: String, required: true },
            position: { type: String, required: true },
            start_date: { type: String, required: true },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean, default: false },
        },
        ],

        projects: [
        {
            name: { type: String, required: true },
            type: { type: String },
            description: { type: String },
        },
        ],

        education: [
        {
            institution: { type: String, required: true },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        },
        ],
  },
      `;
    const response = await this.openai.chat.completions.create({
      model: this.configService.get<string>('GEMINI_MODEL')!,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        { role: 'user', content: userPrompst },
      ],
      response_format: { type: 'json_object' },
    });
    const extractedData = response.choices[0].message?.content;

    const parsedData = JSON.parse(extractedData);

    const newResume = await this.prisma.resume.create({
      data: {
        userId,
        title,
        ...parsedData,
      },
    });

    return { resumeId: newResume.id };
  }
}
