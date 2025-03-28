import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend's origin
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Allowed headers
  credentials: true // Allow cookies if needed
}));

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected for real-time updates');

  ws.on('error', (error) => {
    console.error('WebSocket server-side error:', error);
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Upload Video Route
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const inputFile = req.file.path;
    const outputFile = `compressed-${uuidv4()}.mp4`;

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputFile,
      '-c:v', 'libx265',
      '-preset', 'slow',
      '-crf', '28',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', 'faststart',
      '-vf', 'scale=-2:1080',
      outputFile
    ]);

    // Broadcast progress to all connected WebSocket clients
    const broadcast = (progress) => {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // 1 corresponds to WebSocket.OPEN
          try {
            client.send(JSON.stringify({
              type: 'progress',
              progress: Math.min(Math.max(progress, 0), 100)
            }));
          } catch (error) {
            console.error('Error sending WebSocket message:', error);
          }
        }
      });
    };

    let totalDuration;
    ffmpeg.stderr.on('data', (data) => {
      const dataStr = data.toString();

      // Extract total duration
      const durationMatch = dataStr.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (durationMatch) {
        const [hours, minutes, seconds] = durationMatch[1].split(':').map(parseFloat);
        totalDuration = hours * 3600 + minutes * 60 + seconds;
      }

      // Extract time progress
      const timeMatch = dataStr.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (timeMatch && totalDuration) {
        const [hours, minutes, seconds] = timeMatch[1].split(':').map(parseFloat);
        const currentTime = hours * 3600 + minutes * 60 + seconds;
        const progressPercentage = Math.round((currentTime / totalDuration) * 100);

        // Broadcast progress
        broadcast(progressPercentage);
      }
    });

    ffmpeg.on('close', async (code) => {
      try {
        if (code === 0) {
          // Ensure 100% progress is sent
          broadcast(100);

          // Upload to S3
          const fileContent = fs.readFileSync(outputFile);
          const fileKey = `compressed/${outputFile}`;
          const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
            Body: fileContent,
            ContentType: 'video/mp4'
          };
          const s3Response = await s3.upload(uploadParams).promise();

          // Send success response
          const presignedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
            Expires: 60 * 60
          });

          res.json({
            message: 'Compression successful',
            presignedUrl
          });
        } else {
          throw new Error('Compression failed');
        }
      } catch (error) {
        console.error('Compression or upload error:', error);
        res.status(500).json({ error: error.message });
      } finally {
        // Clean up files
        try {
          fs.unlinkSync(inputFile);
          fs.unlinkSync(outputFile);
        } catch (cleanupError) {
          console.error('Error cleaning up files:', cleanupError);
        }
      }
    });

    ffmpeg.on('error', (error) => {
      console.error('FFmpeg error:', error);
      res.status(500).json({ error: 'FFmpeg process failed' });
    });

  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ error: error.message });
  }
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);

export default app;