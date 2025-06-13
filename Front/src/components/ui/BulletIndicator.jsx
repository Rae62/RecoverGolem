import React from 'react';
import { useLocation } from 'react-router-dom';

const BulletIndicator = () => {
  const location = useLocation();
  const pages = ['/', '/onboarding-1', '/onboarding-2'];
  const currentIndex = pages.indexOf(location.pathname);

  return (
    <div className="flex gap-2 justify-center mt-4">
      {pages.map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full ${
            index === currentIndex ? 'bg-white' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

export default BulletIndicator;