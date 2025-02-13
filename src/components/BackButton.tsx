import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      Back
    </button>
  );
};

export default BackButton;
