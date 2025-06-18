
import { useState, useEffect } from 'react';

interface LogoSplashProps {
  onComplete: () => void;
}

const LogoSplash = ({ onComplete }: LogoSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary flex items-center justify-center z-50 animate-fade-out">
        <div className="text-center animate-scale-out">
          <img 
            src="/lovable-uploads/1d2236a3-cd00-401f-a3ac-6eecf0583bd1.png" 
            alt="Millux Collections" 
            className="h-32 w-auto mx-auto mb-4"
          />
          <div className="text-brand-light text-xl font-semibold">MilluxCollections</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <img 
          src="/lovable-uploads/1d2236a3-cd00-401f-a3ac-6eecf0583bd1.png" 
          alt="Millux Collections" 
          className="h-32 w-auto mx-auto mb-4 animate-pulse"
        />
        <div className="text-brand-light text-xl font-semibold animate-fade-in delay-500">MilluxCollections</div>
        <div className="mt-4">
          <div className="w-16 h-1 bg-brand-accent rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LogoSplash;
