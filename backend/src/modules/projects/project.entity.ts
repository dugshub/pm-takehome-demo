import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Deliverable } from '../deliverables/deliverable.entity';
import { ProjectManager } from '../project-managers/project-manager.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column()
  projectManagerId: string;

  @ManyToOne(() => ProjectManager, (pm) => pm.projects, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'projectManagerId' })
  projectManager: ProjectManager;

  @OneToMany(() => Deliverable, (deliverable) => deliverable.project)
  deliverables: Deliverable[];
}
