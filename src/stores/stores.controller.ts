import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags }  from '@nestjs/swagger';


@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Public()
  @ResponseMessage("Create a new store")
  create(@Body() createStoreDto: CreateStoreDto, @User() user: IUser) {
    return this.storesService.create(createStoreDto, user);
    }

  @Public()
  @Get()
  @ResponseMessage("Fetch stores with paginate")
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.storesService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Get a store by id")
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a store by id")
  update(
    @Param('id') id: string, 
    @Body() updateStoreDto: UpdateStoreDto,
    @User() user: IUser) {
    return this.storesService.update(id, updateStoreDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a store")
  remove(
    @Param('id') id: string,
    @User() user: IUser) {
    return this.storesService.remove(id, user);
  }
}
