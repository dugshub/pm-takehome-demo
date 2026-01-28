import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManagersService } from './project-managers.service';
import { ProjectManager } from './project-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectManager])],
  controllers: [ProjectManagersController],
  providers: [ProjectManagersService],
  exports: [ProjectManagersService],
})
export class ProjectManagersModule {}
