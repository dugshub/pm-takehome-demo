import React from 'react';
import type { DeliverableStatus, ProjectStatus } from '../../types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'gray' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-800',
  blue: 'bg-blue-100 text-blue-800',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gray',
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const getDeliverableStatusVariant = (status: DeliverableStatus): BadgeVariant => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'overdue':
      return 'danger';
    case 'pending':
    default:
      return 'gray';
  }
};

export const getProjectStatusVariant = (status: ProjectStatus): BadgeVariant => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'blue';
    case 'on_hold':
    default:
      return 'gray';
  }
};

export const StatusBadge: React.FC<{ status: DeliverableStatus | ProjectStatus; type?: 'deliverable' | 'project' }> = ({
  status,
  type = 'deliverable',
}) => {
  const variant = type === 'project'
    ? getProjectStatusVariant(status as ProjectStatus)
    : getDeliverableStatusVariant(status as DeliverableStatus);

  const label = status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return <Badge variant={variant}>{label}</Badge>;
};
