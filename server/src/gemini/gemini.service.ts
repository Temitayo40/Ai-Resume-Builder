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
    if (!userId || !resumeText || !title) {
      throw new Error('Missing required parameters');
    }

    const systemPrompt =
      'You are an expert AI Agent trained to extract structured data from resumes.';
    const userPrompt = `Extract data from this resume text:\n${resumeText}\n
  Provide a valid JSON object only (no markdown or explanations), matching this structure:

  {
    "professional_summary": "",
    "skills": [],

    "personal_info": {
      "image": "",
      "full_name": "",
      "profession": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "website": ""
    },

    "experience": [
      {
        "company": "",
        "position": "",
        "start_date": "",
        "end_date": "",
        "description": "",
        "is_current": false
      }
    ],

    "projects": [
      {
        "name": "",
        "type": "",
        "description": ""
      }
    ],

    "education": [
      {
        "institution": "",
        "degree": "",
        "field": "",
        "graduation_date": "",
        "gpa": ""
      }
    ]
  }`;

    const response = await this.openai.chat.completions.create({
      model: this.configService.get<string>('GEMINI_MODEL')!,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const extractedData = response.choices[0].message?.content;

    let parsedData: any;
    try {
      parsedData = JSON.parse(extractedData ?? '{}');
    } catch {
      throw new Error('Invalid JSON format returned from Gemini');
    }

    const newResume = await this.prisma.resume.create({
      data: { userId, title, ...parsedData },
    });

    return { resumeId: newResume.id };
  }
}
// response_format: { type: 'json_object' },
