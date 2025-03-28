import  { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Download, Video } from 'lucide-react';
import { UploadArea } from './components/UploadArea';
import { ProgressBar } from './components/ProgressBar';
import type { UploadProgress } from './types';

const BACKEND_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function App() {
  const [progress, setProgress] = useState<UploadProgress>({
    status: 'idle',
    uploadProgress: 0,
    compressionProgress: 0,
    showUploadBar: false,
    showCompressionBar: false
  });

 useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'progress') {
            setProgress(prev => ({
              ...prev,
              status: 'compressing',
              compressionProgress: data.progress,
              showCompressionBar: true
            }));
          }
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('WebSocket connection failed');
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      toast.error('Failed to establish WebSocket connection');
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Handle progress bar visibility
  useEffect(() => {
    if (progress.uploadProgress === 100) {
      const timer = setTimeout(() => {
        setProgress(prev => ({ ...prev, showUploadBar: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress.uploadProgress]);

  useEffect(() => {
    if (progress.compressionProgress === 100) {
      const timer = setTimeout(() => {
        setProgress(prev => ({ ...prev, showCompressionBar: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress.compressionProgress]);

  const handleFileSelect = async (file: File) => {
    try {
      setProgress({
        status: 'uploading',
        uploadProgress: 0,
        compressionProgress: 0,
        showUploadBar: true,
        showCompressionBar: false //Intially hide compression bar
      });

      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setProgress(prev => ({
            ...prev,
            status: progress === 100 ? 'compressing' : 'uploading',
            uploadProgress: progress,
          }));
        }
      });

      setProgress(prev => ({
        ...prev,
        status: 'completed',
        compressionProgress: 100,
        downloadUrl: response.data.presignedUrl
      }));

      toast.success('Video compression completed!', {
        duration: 5000,
        icon: '🎉'
      });
    } catch (error) {
      console.error('Upload error:', error);
     // More detailed error handling
      const errorMessage = axios.isAxiosError(error) 
        ? (error.response?.data?.error || 'Upload failed')
        : 'An unexpected error occurred';
      setProgress({
        status: 'error',
        uploadProgress: 0,
        compressionProgress: 0,
        showUploadBar: false,
        showCompressionBar: false,
        error: errorMessage
      });
      toast.error(errorMessage);
    }
  };

   const handleDownload = () => {
    if (progress.downloadUrl) {
      window.open(progress.downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Video className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              Video Compression Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your video and we'll compress it while maintaining quality. 
              Perfect for sharing on social media or reducing storage space.
            </p>
          </div>

          <div className="flex-1 flex flex-col space-y-8 items-center">
            <div className="w-full max-w-2xl">
              <UploadArea
                onFileSelect={handleFileSelect}
                disabled={progress.status === 'uploading' || progress.status === 'compressing'}
              />
            </div>

            <div className="w-full max-w-2xl space-y-4">
              {progress.showUploadBar && progress.status !== 'idle' && (
                <ProgressBar 
                  label="Upload Progress"
                  progress={progress.uploadProgress}
                  status={progress.status === 'uploading' ? 'active' : 'completed'}
                  type="upload"
                />
              )}
              
              {(progress.showCompressionBar || progress.compressionProgress > 0) && (
              <ProgressBar 
                label="Compression Progress"
                progress={progress.compressionProgress}
                status={progress.status === 'compressing' ? 'active' : 
                        progress.status === 'completed' ? 'completed' : 'active'}
                type="compress"
              />
            )}
            </div>

              {progress.status === 'completed' && progress.downloadUrl && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download Compressed Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App