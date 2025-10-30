import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ResumeModule } from './resume/resume.module';
import { ImagekitModule } from './imagekit/imagekit.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ResumeModule,
    ImagekitModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
