import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
