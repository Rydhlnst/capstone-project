# VibelyTube Essential Backend

A simplified, standalone implementation of the VibelyTube system focusing on core YouTube analysis and chat functionality.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev

# Start production server
npm start
```

## 🏗️ Architecture

```
src/
├── server.ts          # Express server setup
├── routes/
│   └── vibelytube.ts  # Main VibelyTube endpoints
└── services/
    ├── youtubeService.ts   # YouTube analysis & processing
    ├── chatService.ts      # OpenAI chat integration
    └── sessionService.ts   # Session management
```

## 📡 API Endpoints

### YouTube Analysis
```
POST /api/vibelytube/analyze
Body: { url: string, sessionId: string }
```

### File Upload
```
POST /api/vibelytube/upload
Form-data: file, sessionId
```

### Chat
```
POST /api/vibelytube/chat
Body: { message: string, sessionId: string }
```

### Session Info
```
GET /api/vibelytube/session/:sessionId
```

## 🔧 Configuration

Required environment variables:
- `OPENAI_API_KEY` - OpenAI API key for chat functionality
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Frontend URL for CORS (default: http://localhost:3000)

Optional:
- `OPENAI_BASE_URL` - Custom OpenAI endpoint
- `CHATBOT_TUBE_URL` - Alternative API key
- `CHATBOT_TUBE_BASE_URL` - Alternative endpoint

## 📦 Dependencies

Essential packages:
- `express` - Web server framework
- `cors` - Cross-origin requests
- `multer` - File upload handling
- `openai` - AI chat integration
- `ytdl-core` - YouTube video processing
- `ffmpeg-static` - Audio extraction

## 🔄 Session Management

Sessions are managed in-memory and include:
- Video/file metadata
- Conversation history
- Automatic cleanup after 24 hours

## 🚦 Health Check

```
GET /api/vibelytube/health
```

Returns service status and timestamp.

## 🎯 Core Features

1. **YouTube Analysis**
   - Video metadata extraction
   - Audio processing with FFmpeg
   - Transcript generation

2. **File Upload**
   - Support for audio, video, PDF, text files
   - 100MB file size limit
   - Automatic content analysis

3. **AI Chat**
   - OpenAI integration
   - Context-aware conversations
   - Fallback responses when AI unavailable

4. **Session Persistence**
   - In-memory session storage
   - Conversation history tracking
   - Metadata preservation

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 📋 Notes

- This is the "intinya aja dongs" (essential version) of VibelyTube
- Simplified architecture without complex authentication
- Focus on core YouTube processing and chat functionality
- Designed for easy deployment and minimal setup
