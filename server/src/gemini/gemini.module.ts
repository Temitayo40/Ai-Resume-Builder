import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule],
  providers: [GeminiService],
  controllers: [GeminiController],
})
export class GeminiModule {}
