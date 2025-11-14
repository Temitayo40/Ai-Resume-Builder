import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string) {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error('JWT secret key is not set');

    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }

  async registerUser(body: { name: string; email: string; password: string }) {
    if (!body.name || !body.email || !body.password) {
      throw new BadRequestException('Missing required fields');
    }
    const { name, email } = body;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(newUser.id);
    console.log(token, 'token');

    const { password, ...safeUser } = newUser;

    return { token, safeUser };
  }

  async Login(body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Missing required fields');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await this.comparePassword(body.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.generateToken(user.id);

    const { password, ...safeUser } = user;

    return { token, safeUser };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async getUserResumes(userId: string) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      include: {
        personal_info: true,
        experience: true,
        projects: true,
        education: true,
      },
    });
    return resumes;
  }
}
