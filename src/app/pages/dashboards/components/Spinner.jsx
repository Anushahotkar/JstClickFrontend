// import React from 'react';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  // Define a mapping for sizes and their corresponding Tailwind CSS classes
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4',
  };

  // Define a mapping for colors and their corresponding Tailwind CSS classes
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-purple-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.medium;
  const selectedColor = colorClasses[color] || colorClasses.primary;

  return (
    <div
      className={`rounded-full animate-spin ${selectedSize} ${selectedColor}`}
    ></div>
  );
};

export default Spinner;