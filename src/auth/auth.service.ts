import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { Login } from '../entities/logins.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Login) private loginsRepo: Repository<Login>,
  ) {}

  async signup(dto: SignupDto) {
    // Check if email already exists
    const existing = await this.loginsRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    // Create User
    const user = this.usersRepo.create({
      user_id: uuidv4(),
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone_number: dto.phone_number,
      state: dto.state,
      city: dto.city,
      address: dto.address,
    });
    await this.usersRepo.save(user);

    // Create Login
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const login = this.loginsRepo.create({
      login_id: uuidv4(),
      user_id: user.user_id,
      email: dto.email,
      password_hash: hashedPassword,
    });
    await this.loginsRepo.save(login);

    return { message: 'Signup successful', user_id: user.user_id };
  }

  async login(dto: LoginDto) {
    const login = await this.loginsRepo.findOne({ where: { email: dto.email } });
    if (!login) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, login.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { message: 'Login successful', user_id: login.user_id };
  }

async uploadProfilePic(userId: string, file: Express.Multer.File) {
  const user = await this.usersRepo.findOne({ where: { user_id: userId } });
  if (!user) throw new NotFoundException('User not found');

  user.profile_pic = file.buffer; // Save as binary
  await this.usersRepo.save(user);

  return { message: 'Profile picture updated successfully', user_id: userId };
}

async getProfilePic(userId: string) {
  const user = await this.usersRepo.findOne({ where: { user_id: userId } });
  if (!user || !user.profile_pic) {
    throw new NotFoundException('Profile picture not found');
  }

  return user.profile_pic;
}

async deleteProfile(userId: string) {
  const user = await this.usersRepo.findOne({ where: { user_id: userId } });

  if (!user) {
    return { message: 'User not found' };
  }

  await this.usersRepo.remove(user); // actually deletes the user
  return { message: 'User deleted successfully' };
}

async updatePassword(userId: string, newPassword: string) {
  const login = await this.loginsRepo.findOne({ where: { user_id: userId } });

  if (!login) {
    return { message: 'User not found' };
  }

  // Hash the new password before saving
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  login.password_hash = hashedPassword;
  await this.usersRepo.save(login);

  return { message: 'Password updated successfully' };
}

async getProfileDetails(userId: string) {
  const user = await this.usersRepo.findOne({ where: { user_id: userId } });
  const login = await this.loginsRepo.findOne({ where: { user_id: userId } });

  if (!user || !login) {
    throw new NotFoundException('Profile not found');
  }

  // remove profile_pic from response
  const { profile_pic, ...userWithoutPic } = user;

  // also remove password_hash from login
  const { password_hash, ...loginWithoutPassword } = login;

  return { user: userWithoutPic, login: loginWithoutPassword };
}

async updateProfileDetails(userId: string, dto: UpdateProfileDto) {
  // Find the existing user
  const user = await this.usersRepo.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Merge the updated fields into the existing user
  Object.assign(user, dto);

  // Save updated user
  await this.usersRepo.save(user);

  return { message: 'Profile updated successfully', user_id: user.user_id };
}

}
