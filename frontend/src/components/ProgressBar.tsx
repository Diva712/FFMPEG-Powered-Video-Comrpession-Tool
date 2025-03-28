
import { Upload, Cog } from 'lucide-react';

interface ProgressBarProps {
  label: string;
  progress: number;
  status: 'active' | 'completed' | 'error';
  type: 'upload' | 'compress';
}

export function ProgressBar({ label, progress, status, type }: ProgressBarProps) {
  const getStatusColor = () => {
    if (status === 'completed') return 'from-green-500 to-green-600';
    return type === 'upload'
      ? 'from-blue-500 to-blue-600'
      : 'from-indigo-500 to-indigo-600';
  };

  const getIcon = () => {
    if (status === 'completed') return null;
    return type === 'upload'
      ? <Upload className="w-5 h-5 animate-bounce" />
      : <Cog className="w-5 h-5 animate-spin" />;
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg transition-opacity duration-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-sm font-medium text-gray-700">
            {label} {status === 'completed' && '(Complete)'}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}