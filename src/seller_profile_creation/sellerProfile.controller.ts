import { Controller, Post, Body, Request, UseGuards, BadRequestException, Param, UploadedFile, UseInterceptors, Res, NotFoundException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SellerProfileService } from './sellerProfile.service';
import { SellerProfileBioDto } from './dto/sellerProfileBio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@ApiTags('Seller Profile')
@Controller('seller-profile')
export class SellerProfileController {
  constructor(private readonly sellerProfileService: SellerProfileService) {}

@Post(':userId/sellerProfile-Bio')
@UseInterceptors(FileInterceptor('file'))
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      bio: { type: 'string', example: 'Experienced seller with a passion for sharing quality items.' },
      photo_id_type: { type: 'string', example: 'Passport' },
      photo_id_number: { type: 'string', example: '123-343-454-544' },
      file: { type: 'string', format: 'binary' },
    },
  },
})
async createSellerProfile(
  @Param('userId') userId: string,
  @Body() bioDto: SellerProfileBioDto,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.sellerProfileService.createSellerProfile(userId, bioDto, file);
}



}