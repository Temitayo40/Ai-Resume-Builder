// src/imagekit/imagekit.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { imagekit } from './imagekit.config';

@Injectable()
export class ImagekitService {
  async uploadFile(file: Express.Multer.File, removeBackground: boolean) {
    try {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: 'user-resumes',
        transformation: {
          pre:
            'w-300,h-300,fo-face,z-0.75' +
            (removeBackground ? ',e-bgremove' : ''),
        },
      });

      return {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      const deleteResponse = await imagekit.deleteFile(fileId);
      return deleteResponse;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
