import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Item } from 'src/entities/items.entity';

@Injectable()
export class rentalRequestService {
    constructor(
                @InjectRepository(Item) private itemRepo: Repository<Item>
    ){}
}