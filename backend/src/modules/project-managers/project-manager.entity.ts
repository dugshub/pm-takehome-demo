import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Deliverable } from '../deliverables/deliverable.entity';
import { Project } from '../projects/project.entity';

@Entity('project_managers')
export class ProjectManager extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  department: string;

  @OneToMany(() => Project, (project) => project.projectManager)
  projects: Project[];

  @OneToMany(() => Deliverable, (deliverable) => deliverable.projectManager)
  deliverables: Deliverable[];
}
