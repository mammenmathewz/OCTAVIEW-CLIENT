import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface LoaderProps {
  text?: string;
  className?: string;
}

const FullPageLoader: React.FC<LoaderProps> = ({ 
  text, 
  className 
}) => {
  return (
    <div 
      className={clsx(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "bg-black/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <Loader2 
          className="h-16 w-16 animate-spin text-white" 
          strokeWidth={1.5} 
        />
        {text && (
          <p 
            className="mt-4 text-lg font-medium text-white 
            text-center max-w-md px-4"
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default FullPageLoader;