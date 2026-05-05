import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/afe-babalola-logo.png"
        alt="AFE BABALOLA UNIVERSITY"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <div className="hidden sm:flex flex-col">
          <span className="font-bold text-sm text-gray-900">AFE BABALOLA</span>
          <span className="text-xs text-gray-600">UNIVERSITY</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
