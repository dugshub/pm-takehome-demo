import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectManager } from './project-manager.entity';
import { CreateProjectManagerDto } from './dto/create-project-manager.dto';
import { UpdateProjectManagerDto } from './dto/update-project-manager.dto';

@Injectable()
export class ProjectManagersService {
  constructor(
    @InjectRepository(ProjectManager)
    private readonly projectManagerRepository: Repository<ProjectManager>,
  ) {}

  async findAll(): Promise<ProjectManager[]> {
    return this.projectManagerRepository.find({ order: { lastName: 'ASC' } });
  }

  async findOne(id: string): Promise<ProjectManager> {
    const projectManager = await this.projectManagerRepository.findOne({
      where: { id },
      relations: ['deliverables', 'deliverables.project'],
    });
    if (!projectManager) {
      throw new NotFoundException(`Project Manager with ID ${id} not found`);
    }
    return projectManager;
  }

  async create(
    createProjectManagerDto: CreateProjectManagerDto,
  ): Promise<ProjectManager> {
    const projectManager = this.projectManagerRepository.create(
      createProjectManagerDto,
    );
    return this.projectManagerRepository.save(projectManager);
  }

  async update(
    id: string,
    updateProjectManagerDto: UpdateProjectManagerDto,
  ): Promise<ProjectManager> {
    const projectManager = await this.findOne(id);
    Object.assign(projectManager, updateProjectManagerDto);
    return this.projectManagerRepository.save(projectManager);
  }

  async remove(id: string): Promise<void> {
    const projectManager = await this.findOne(id);
    await this.projectManagerRepository.remove(projectManager);
  }
}
