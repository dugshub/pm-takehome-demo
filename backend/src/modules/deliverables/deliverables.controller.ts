import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

@Controller('api/deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('dueBefore') dueBefore?: string,
    @Query('dueAfter') dueAfter?: string,
  ) {
    return this.deliverablesService.findAll({
      projectId,
      status,
      dueBefore,
      dueAfter,
    });
  }

  @Get('upcoming')
  findUpcoming() {
    return this.deliverablesService.findUpcoming();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliverablesService.findOne(id);
  }

  @Post()
  create(@Body() createDeliverableDto: CreateDeliverableDto) {
    return this.deliverablesService.create(createDeliverableDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeliverableDto: UpdateDeliverableDto,
  ) {
    return this.deliverablesService.update(id, updateDeliverableDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliverablesService.remove(id);
  }
}
