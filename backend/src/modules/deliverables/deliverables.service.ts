import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { Deliverable } from './deliverable.entity';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';

interface FindAllFilters {
  projectId?: string;
  status?: string;
  dueBefore?: string;
  dueAfter?: string;
}

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectRepository(Deliverable)
    private readonly deliverableRepository: Repository<Deliverable>,
  ) {}

  async findAll(filters: FindAllFilters): Promise<Deliverable[]> {
    const queryBuilder = this.deliverableRepository
      .createQueryBuilder('deliverable')
      .leftJoinAndSelect('deliverable.project', 'project')
      .leftJoinAndSelect('deliverable.projectManager', 'projectManager');

    if (filters.projectId) {
      queryBuilder.andWhere('deliverable.projectId = :projectId', {
        projectId: filters.projectId,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('deliverable.status = :status', {
        status: filters.status,
      });
    }

    if (filters.dueBefore) {
      queryBuilder.andWhere('deliverable.dueDate <= :dueBefore', {
        dueBefore: filters.dueBefore,
      });
    }

    if (filters.dueAfter) {
      queryBuilder.andWhere('deliverable.dueDate >= :dueAfter', {
        dueAfter: filters.dueAfter,
      });
    }

    queryBuilder.orderBy('deliverable.dueDate', 'ASC');

    return queryBuilder.getMany();
  }

  async findUpcoming(): Promise<Deliverable[]> {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const todayStr = today.toISOString().split('T')[0];
    const futureStr = thirtyDaysFromNow.toISOString().split('T')[0];

    return this.deliverableRepository.find({
      where: {
        dueDate: Between(new Date(todayStr), new Date(futureStr)),
      },
      relations: ['project', 'projectManager'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Deliverable> {
    const deliverable = await this.deliverableRepository.findOne({
      where: { id },
      relations: ['project', 'projectManager'],
    });
    if (!deliverable) {
      throw new NotFoundException(`Deliverable with ID ${id} not found`);
    }
    return deliverable;
  }

  async create(createDeliverableDto: CreateDeliverableDto): Promise<Deliverable> {
    const deliverable = this.deliverableRepository.create(createDeliverableDto);
    const saved = await this.deliverableRepository.save(deliverable);
    return this.findOne(saved.id);
  }

  async update(
    id: string,
    updateDeliverableDto: UpdateDeliverableDto,
  ): Promise<Deliverable> {
    const deliverable = await this.findOne(id);
    Object.assign(deliverable, updateDeliverableDto);
    await this.deliverableRepository.save(deliverable);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deliverable = await this.findOne(id);
    await this.deliverableRepository.remove(deliverable);
  }
}
