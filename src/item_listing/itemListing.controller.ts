import { Controller, Post, Body, Request, UseGuards, BadRequestException, Param, UploadedFile, UseInterceptors, Res, NotFoundException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CreateItemDto } from './dto/itemPublish.dto';
import { ItemListingService } from './itemListing.service';
import { title } from 'process';
@ApiTags('Item Listing')
@Controller('item-listing')
export class ItemListingController {
  constructor(private readonly itemListingService: ItemListingService) {}

  @Post(':sellerId')
  @UseInterceptors(FileInterceptor('file')) // must match form-data key
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Canon DSLR Camera' },
        description: { type: 'string', example: 'High quality DSLR camera for professional shoots' },
        price_per_day: { type: 'number', example: 500.00 },
        deposit_amount: { type: 'number', example: 1000.00 },
        conditions: { 
          type: 'string', 
          enum: ['new', 'like new', 'good', 'used', 'old'], 
          example: 'good' 
        },
        location: { type: 'string', example: 'Bangalore, India' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['title', 'price_per_day', 'conditions'], // only required fields
    },
  })
  async createItem(
    @Param('sellerId') sellerId: string,
    @Body() dto: CreateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.itemListingService.itemListing(sellerId, dto, file);
  }

   @Get(':itemId/profile-picture')
  async getProfilePic(@Param('itemId') itemId: string, @Res() res: Response) {
    const image = await this.itemListingService.getProfilePic(itemId);
    if (!image) throw new NotFoundException('No image found');
    res.setHeader('Content-Type', 'image/jpeg'); // TODO: detect actual mime
    res.send(image);
  }
}