import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthRequest } from 'src/auth/express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/users/')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      const { token, safeUser } = await this.userService.registerUser(body);
      return { message: 'User Created Successfully', token, iser: safeUser };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred during registration',
      );
    }
  }

  @Post('login')
  @HttpCode(201)
  async Login(@Body() body: { email: string; password: string }) {
    try {
      const { token, safeUser } = await this.userService.Login(body);
      return { message: 'User Created Successfully', token, user: safeUser };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred during login',
      );
    }
  }

  // this is getting data for the loggen in user
  @Get('data')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getUserById(@Req() req: AuthRequest) {
    const userId = req.userId as string;
    try {
      const user = await this.userService.getUserById(userId);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error: cannot get user by id',
      );
    }
  }

  // resumes attached to the logged in user
  @Get('resumes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getUserResumes(@Req() req: AuthRequest) {
    const userId = req.userId as string;
    try {
      const user = await this.userService.getUserResumes(userId);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        'An unexpected error occurred getting resumes',
      );
    }
  }
}
