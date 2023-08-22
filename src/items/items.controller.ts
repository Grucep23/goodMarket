import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags }  from '@nestjs/swagger';


@ApiTags('items')
@Controller('items')
  export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}
  
    @Post()
    @ResponseMessage("create a new item")
    create(@Body() createItemDto: CreateItemDto, @User() user: IUser) {
      return this.itemsService.create(createItemDto, user);
    }
  
    @Get()
    @Public()
    @ResponseMessage('fetch items with paginate')
    findAll(
      @Query('current') currentPage: string,
      @Query('pageSize') limit: string,
      @Query() qs: string,
    ) {
      return this.itemsService.findAll(+currentPage, +limit, qs);
    }
  
    @Public()
    @Get(':id')
    @Public()
    @ResponseMessage('fetch item by id')
    findOne(@Param('id') id: string) {
      return this.itemsService.findOne(id);
    }
  
    @Patch(':id')
    @ResponseMessage("update a item")
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto, 
    @User() user: IUser
    ) {
        return this.itemsService.update(id, updateItemDto, user);
    }
  
    @Delete(':id')
    @ResponseMessage("delete a item")
    remove(@Param('id') id: string, @User() user: IUser) {
      return this.itemsService.remove(id, user);
    }
  }
