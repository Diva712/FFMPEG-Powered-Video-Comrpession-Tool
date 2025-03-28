import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export function UploadArea({ onFileSelect, disabled }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    disabled,
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-3 border-dashed rounded-xl transition-all duration-300 bg-white shadow-lg ${
        isDragActive 
          ? 'border-indigo-500 bg-indigo-50 scale-102' 
          : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
      } ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer transform hover:scale-102'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        {isDragActive ? (
          <FileVideo className="w-16 h-16 mb-4 text-indigo-500 animate-bounce" />
        ) : (
          <Upload className="w-16 h-16 mb-4 text-gray-400" />
        )}
        <p className="text-xl font-medium text-gray-700 mb-2">
          {isDragActive ? "Drop your video here" : "Drag & drop your video here"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to select a file
        </p>
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-400">
            Supported formats: MP4, MOV, AVI, MKV
          </p>
        </div>
      </div>
    </div>
  );
}