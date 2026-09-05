import React from 'react';

interface StudentAvatarProps {
  name?: string | null;
  avatar?: string | null;
  className?: string;
  textClassName?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({ name = 'Learner', avatar, className = 'w-10 h-10 rounded-full', textClassName = 'text-sm' }) => {
  const initial = (name || 'L').trim().charAt(0).toUpperCase() || 'L';
  if (avatar) {
    return <img src={avatar} alt={name || 'Learner'} className={`${className} object-cover`} />;
  }
  return (
    <div aria-label={name || 'Learner'} className={`${className} bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-sm`}>
      <span className={textClassName}>{initial}</span>
    </div>
  );
};
