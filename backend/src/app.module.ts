import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectManagersModule } from './modules/project-managers/project-managers.module';
import { DeliverablesModule } from './modules/deliverables/deliverables.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProjectsModule,
    ProjectManagersModule,
    DeliverablesModule,
  ],
})
export class AppModule {}
