export interface UploadProgress {
  status: 'idle' | 'uploading' | 'compressing' | 'completed' | 'error';
  uploadProgress: number;
  compressionProgress: number;
  showUploadBar: boolean;
  showCompressionBar: boolean;
  downloadUrl?: string;
  error?: string;
}