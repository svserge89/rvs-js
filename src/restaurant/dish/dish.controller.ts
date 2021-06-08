import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {FileInterceptor} from '@nestjs/platform-express';

import {RoleAdmin} from '../../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../../auth/guards/roles.guard';
import {ImageValidationPipe} from '../../image/pipe/image-validation.pipe';
import {DishService} from './dish.service';
import {CreateDishDto} from './dto/create-dish.dto';
import {DishPageResponseDto} from './dto/dish-page-response.dto';
import {DishResponseDto} from './dto/dish-response.dto';
import {FindDishesDto} from './dto/find-dishes.dto';
import {UpdateDishDto} from './dto/update-dish.dto';

@Controller('restaurant/:restaurantId/dish')
@UseGuards(AuthGuard(), RolesGuard)
@RoleAdmin()
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body(new ValidationPipe({transform: true})) dishDto: CreateDishDto,
  ): Promise<DishResponseDto> {
    return this.dishService.create(restaurantId, dishDto);
  }

  @Put(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ): Promise<void> {
    return this.dishService.updateImage(restaurantId, id, image);
  }

  @Patch(':id')
  update(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({transform: true})) dishDto: UpdateDishDto,
  ): Promise<DishResponseDto> {
    return this.dishService.update(restaurantId, id, dishDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.dishService.delete(restaurantId, id);
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.dishService.removeImage(restaurantId, id);
  }

  @Get(':id')
  findOne(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DishResponseDto> {
    return this.dishService.findOne(restaurantId, id);
  }

  @Get()
  find(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Query(new ValidationPipe({transform: true})) dishesDto: FindDishesDto,
  ): Promise<DishPageResponseDto> {
    return this.dishService.find(restaurantId, dishesDto);
  }
}
