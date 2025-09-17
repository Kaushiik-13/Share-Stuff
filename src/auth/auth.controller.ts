import {Controller,Post,Body,Param,Get,Res,UseInterceptors,UploadedFile,NotFoundException, Put, Delete,} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Signup & Login
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Profile Picture
  @Put(':userId/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadProfilePic(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.uploadProfilePic(userId, file);
  }

  @Get(':userId/profile-picture')
  async getProfilePic(@Param('userId') userId: string, @Res() res: Response) {
    const image = await this.authService.getProfilePic(userId);
    if (!image) throw new NotFoundException('No image found');
    res.setHeader('Content-Type', 'image/jpeg'); // TODO: detect actual mime
    res.send(image);
  }

  // Profile CRUD
  @Get(':userId/profile')
  async getProfileDetails(@Param('userId') userId: string, @Res() res: Response) {
    const user = await this.authService.getProfileDetails(userId);
    if (!user) throw new NotFoundException('Profile not found');
    res.send(user);
  }

  @Put(':userId/profile')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto
  ) {
    return this.authService.updateProfileDetails(userId, dto);
  }

  @Delete(':userId/profile')
  async deleteProfile(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.authService.deleteProfile(userId);
    return res.json(result);
  }

  // Password
  @Put(':userId/password')
  async updatePassword(
    @Param('userId') userId: string,
    @Body() body: UpdatePasswordDto
  ) {
    return this.authService.updatePassword(userId, body.newPassword);
  }
}
