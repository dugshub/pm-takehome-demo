import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Project } from '../projects/project.entity';
import { ProjectManager } from '../project-managers/project-manager.entity';

export enum DeliverableStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

@Entity('deliverables')
export class Deliverable extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'varchar',
    default: DeliverableStatus.PENDING,
  })
  status: DeliverableStatus;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.deliverables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectManagerId: string;

  @ManyToOne(() => ProjectManager, (pm) => pm.deliverables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectManagerId' })
  projectManager: ProjectManager;
}
