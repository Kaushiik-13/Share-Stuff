import { Controller, Post, Body, Request, UseGuards, BadRequestException, Param, UploadedFile, UseInterceptors, Res, NotFoundException, Get, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { rentalRequestService } from './rentalRequest.service';
@ApiTags('Item Listing')
@Controller('item-listing')
export class rentalRequestController {
  constructor(private readonly rentalRequestService:rentalRequestService ) { }
}