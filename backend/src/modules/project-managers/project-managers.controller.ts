import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectManagersService } from './project-managers.service';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Controller('api/project-managers')
export class ProjectManagersController {
  constructor(
    private readonly projectManagersService: ProjectManagersService,
  ) {}

  @Get()
  findAll() {
    return this.projectManagersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectManagersService.findOne(id);
  }

  @Post()
  create(@Body() createProjectManagerDto: CreateProjectManagerDto) {
    return this.projectManagersService.create(createProjectManagerDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectManagerDto: UpdateProjectManagerDto,
  ) {
    return this.projectManagersService.update(id, updateProjectManagerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectManagersService.remove(id);
  }
}
