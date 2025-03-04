import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  // Get first letter of the name
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  // Generate a consistent background color based on the name
  const colors = [
    'bg-primary-light',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];
  
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  if (src) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <Image
          src={src}
          alt={name}
          fill
          className="rounded-full object-cover ring-2 ring-gray-100"
        />
      </div>
    );
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${bgColor} 
        ${className}
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-medium
        ring-2 
        ring-gray-100
      `}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar; 