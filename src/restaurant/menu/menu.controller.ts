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
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {RoleAdmin} from '../../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../../auth/guards/roles.guard';
import {CreateMenuEntryDto} from './dto/create-menu-entry.dto';
import {FindMenuEntriesDto} from './dto/find-menu-entries.dto';
import {MenuEntryPageResponseDto} from './dto/menu-entry-page-response.dto';
import {MenuEntryResponseDto} from './dto/menu-entry-response.dto';
import {UpdateMenuEntryDto} from './dto/update-menu-entry.dto';
import {MenuService} from './menu.service';

@Controller('restaurant/:restaurantId/menu')
export class MenuController {
  constructor(private readonly menuEntryService: MenuService) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,

    @Body(new ValidationPipe({transform: true}))
    menuEntryDto: CreateMenuEntryDto,
  ): Promise<MenuEntryResponseDto> {
    return this.menuEntryService.create(restaurantId, menuEntryDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  update(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,

    @Body(new ValidationPipe({transform: true}))
    menuEntryDto: UpdateMenuEntryDto,
  ): Promise<MenuEntryResponseDto> {
    return this.menuEntryService.update(restaurantId, id, menuEntryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  delete(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.menuEntryService.delete(restaurantId, id);
  }

  @Get(':id')
  findOne(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MenuEntryResponseDto> {
    return this.menuEntryService.findOne(restaurantId, id);
  }

  @Get()
  find(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,

    @Query(new ValidationPipe({transform: true}))
    findMenuEntriesDto: FindMenuEntriesDto,
  ): Promise<MenuEntryPageResponseDto> {
    return this.menuEntryService.find(restaurantId, findMenuEntriesDto);
  }
}
