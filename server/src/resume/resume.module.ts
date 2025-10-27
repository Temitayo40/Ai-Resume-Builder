import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, ImagekitModule, AuthModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
