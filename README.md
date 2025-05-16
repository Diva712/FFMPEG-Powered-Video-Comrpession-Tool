# 🎥 Video Compression Tool using FFmpeg

A fullstack application that enables efficient video compression using FFmpeg, built with React.js frontend and Node.js backend with AWS S3 storage integration.

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technologies Used](#️-technologies-used)
- [System Architecture](#️-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [FFmpeg Installation](#ffmpeg-installation)
  - [AWS S3 Bucket Setup](#aws-s3-bucket-setup)
  - [Project Setup](#project-setup)
- [Running the Application](#-running-the-application)
- [How It Works](#-how-it-works)
- [Performance](#-performance)
- [Limitations](#️-limitations)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)

## 📝 Overview

This Video Compression Tool is designed to reduce video file sizes while maintaining acceptable quality for efficient storage and transmission. The application provides an intuitive user interface for uploading videos, compressing them using FFmpeg's H.265 encoding, and downloading the compressed results from AWS S3.

## ✨ Features

- 🔄 Efficient video compression using H.265 (HEVC) codec
- 📊 Real-time compression progress updates
- ☁️ Cloud storage integration with AWS S3
- 📱 Responsive, user-friendly interface
- 🔽 Secure download links via pre-signed URLs
- 📁 Support for various video formats

## 🛠️ Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Video Processing**: FFmpeg
- **Cloud Storage**: AWS S3
- **Real-time Updates**: WebSockets
- **API Testing**: Postman

## 🏗️ System Architecture

The application follows a client-server architecture:

1. **Frontend (React)**: Handles user interaction, file uploads, and displays compression progress
2. **Backend (Node.js)**: Processes video compression using FFmpeg and manages file operations
3. **Storage (AWS S3)**: Stores and serves compressed video files securely

## 📋 Prerequisites

- Node.js (v14.0 or higher)
- npm (v6.0 or higher)
- FFmpeg installed on your system
- AWS account with S3 access
- Basic understanding of terminal/command prompt

## 🔧 Installation

### FFmpeg Installation

#### For Windows:
1. Download FFmpeg from [official website](https://ffmpeg.org/download.html) or use a package manager like Chocolatey:
   ```
   choco install ffmpeg
   ```
2. Add FFmpeg to your system PATH
3. Verify installation:
   ```
   ffmpeg -version
   ```

#### For macOS:
Using Homebrew:
```
brew install ffmpeg
```

#### For Linux (Ubuntu/Debian):
```
sudo apt update
sudo apt install ffmpeg
```

Verify installation:
```
ffmpeg -version
```

### AWS S3 Bucket Setup

1. Sign in to the [AWS Management Console](https://aws.amazon.com/console/)
2. Navigate to S3 service
3. Create a new bucket named `my-video-compressor-bucket-1234` (or choose your own name)
4. Set the region to `ap-south-1` (Mumbai) or your preferred region
5. Keep default settings or adjust based on your requirements
6. Create IAM credentials (Access Key and Secret Key) with S3 access permissions

### Project Setup

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/video-compression-tool.git
   cd video-compression-tool
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your AWS credentials:
   ```
   AWS_ACCESS_KEY=your_access_key
   AWS_SECRET_KEY=your_secret_key
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=my-video-compressor-bucket-1234
   PORT=5000
   ```

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## 🚀 Running the Application

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```
   The server will run on port 5000.

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```
   The frontend will be accessible at http://localhost:5173/

3. Open your browser and navigate to http://localhost:5173/

## 🔄 How It Works

1. **Video Upload**: Select and upload a video through the user interface
2. **Processing**: The backend receives the video and processes it using FFmpeg with the following parameters:
   - H.265 (HEVC) codec for efficient compression
   - Constant Rate Factor (CRF) of 28 for quality balance
   - Scale to 1080p height while maintaining aspect ratio
   - AAC audio codec at 128kbps
3. **Progress Updates**: Real-time progress is displayed in the frontend
4. **Storage**: Compressed video is stored in AWS S3
5. **Download**: A pre-signed URL is generated for secure access to the compressed file

## 📊 Performance

Based on testing results, the tool achieves impressive compression ratios:

| Resolution | Original Size | Compressed Size | Compression Ratio |
|------------|--------------|-----------------|-------------------|
| 360p       | 4.88 MB      | 2.14 MB         | 2.28:1            |
| 720p (HD)  | 7.69 MB      | 4.00 MB         | 1.92:1            |
| 1080p (FHD)| 10.0 MB      | 6.90 MB         | 1.45:1            |
| 1080p (FHD)| 20.0 MB      | 13.2 MB         | 1.52:1            |

## ⚠️ Limitations

- **Hardware Dependencies**: Compression speed depends on CPU performance (built with i3 processor in mind)
- **Large File Handling**: May experience delays with very large videos (4K or higher resolutions)
- **Processing Time**: Not optimized for real-time compression
- **Local Processing**: Currently relies on local CPU for compression

## 🔮 Future Enhancements

- GPU acceleration for faster compression
- User-controlled compression cancellation
- Custom compression profiles
- Docker containerization
- AI-driven adaptive compression
- Cloud deployment on AWS EC2
- Real-time video compression for streaming applications


---

*This project was developed as part of a Bachelor of Technology degree in Electronics & Telecommunication Engineering at Jabalpur Engineering College, Jabalpur (M.P.)*
