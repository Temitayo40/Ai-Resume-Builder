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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    try {
      const { token, safeUser } = await this.userService.registerUser(body);
      return { message: 'User Created Successfully', token, safeUser };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(201)
  async Login(@Body() body: { email: string; password: string }) {
    try {
      const { token, safeUser } = await this.userService.Login(body);
      return { message: 'User Created Successfully', token, safeUser };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('data')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getUserById(@Req() req: AuthRequest) {
    const userId = req.userId as string;
    try {
      const user = await this.userService.getUserById(userId);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
