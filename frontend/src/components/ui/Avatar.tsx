import React from 'react';

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

// Generate a consistent color based on the name
const getColorFromName = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  size = 'md',
  showName = true,
  className = '',
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;
  const bgColor = getColorFromName(fullName);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${bgColor}
          rounded-full
          flex items-center justify-center
          text-white font-medium
          flex-shrink-0
        `}
        title={fullName}
      >
        {initials}
      </div>
      {showName && (
        <span className="text-gray-900 font-medium truncate">{fullName}</span>
      )}
    </div>
  );
};

export const UserBadge: React.FC<AvatarProps & { department?: string }> = ({
  firstName,
  lastName,
  department,
  size = 'sm',
  className = '',
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;
  const bgColor = getColorFromName(fullName);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${bgColor}
          rounded-full
          flex items-center justify-center
          text-white font-medium
          flex-shrink-0
        `}
      >
        {initials}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 leading-tight">{fullName}</span>
        {department && (
          <span className="text-xs text-gray-500 leading-tight">{department}</span>
        )}
      </div>
    </div>
  );
};
