# 🎬 VibelyTube Essential - Intinya aja dongs!

Versi essential dan standalone dari sistem VibelyTube yang fokus pada analisis YouTube dan chat AI. Project ini dibuat dengan prinsip "intinya aja dongs" - hanya fitur-fitur core yang paling penting.

## 🎯 Apa itu VibelyTube Essential?

VibelyTube Essential adalah versi simplified dari sistem VibelyTube lengkap yang menghilangkan kompleksitas authentication, token management, dan fitur-fitur advanced lainnya. Yang tersisa adalah:

- ✅ **Analisis YouTube** - Input URL, dapatkan metadata dan transcript
- ✅ **Upload File** - Support audio, video, PDF, text files  
- ✅ **AI Chat** - Chat dengan AI tentang konten yang sudah dianalisis
- ✅ **Session Management** - Conversation history per session
- ✅ **Modern UI** - Clean, responsive React interface

## 🏗️ Architecture

```
Intinya aja dongs/
├── backend/              # Express.js API Server
│   ├── src/
│   │   ├── server.ts           # Main server
│   │   ├── routes/
│   │   │   └── vibelytube.ts   # API endpoints
│   │   └── services/
│   │       ├── youtubeService.ts   # YouTube processing
│   │       ├── chatService.ts      # OpenAI integration
│   │       └── sessionService.ts   # Session management
│   ├── package.json
│   └── README.md
│
└── frontend/             # React + TypeScript UI
    ├── src/
    │   ├── App.tsx            # Main component
    │   ├── main.tsx           # Entry point
    │   └── index.css          # Global styles
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- OpenAI API key (opsional - ada fallback)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan API keys
npm run dev
```

Server akan running di: http://localhost:3001

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

UI akan tersedia di: http://localhost:3000

## 🔧 Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

# OpenAI (Primary)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# CORS
CORS_ORIGIN=http://localhost:3000

# Optional
CHATBOT_TUBE_URL=alternative_api_key
CHATBOT_TUBE_BASE_URL=alternative_endpoint
```

### Frontend
- Auto proxy ke backend via Vite
- No configuration needed untuk development

## 📡 API Endpoints

```bash
# Analisis YouTube
POST /api/vibelytube/analyze
Body: { url: string, sessionId: string }

# Upload file
POST /api/vibelytube/upload  
Form-data: file, sessionId

# Chat dengan AI
POST /api/vibelytube/chat
Body: { message: string, sessionId: string }

# Info session
GET /api/vibelytube/session/:sessionId

# Health check
GET /api/vibelytube/health
```

## 🎪 User Flow

1. **Pilih Mode**: YouTube URL atau Upload File
2. **Input Content**: Masukkan URL atau pilih file
3. **Analisis**: Click "Analisis & Mulai Chat"
4. **Chat**: Tanyakan apapun tentang konten
5. **Continue**: Chat berkelanjutan dengan context

## ✨ Features

### YouTube Processing
- Video metadata extraction via ytdl-core
- Audio extraction dengan FFmpeg  
- Mock transcript generation
- Graceful fallback jika dependencies not available

### File Upload
- Support multiple formats: audio, video, PDF, text
- 100MB file size limit
- Multipart upload dengan multer
- Content analysis preprocessing

### AI Chat
- OpenAI GPT-4 integration
- Context-aware conversations
- Fallback responses jika API unavailable
- Conversation history preservation

### Session Management  
- In-memory session storage
- Auto-cleanup setelah 24 jam
- Metadata preservation
- Message history tracking

### Modern UI
- React + TypeScript
- Responsive design
- Beautiful gradients & animations
- Real-time chat interface
- Error handling dengan notifications

## 🔄 Differences from Full VibelyTube

**Removed:**
- ❌ Complex authentication system
- ❌ Token management & deduction
- ❌ Karina service integration  
- ❌ Advanced user management
- ❌ Database persistence
- ❌ Multi-tenant support

**Kept:**
- ✅ Core YouTube analysis
- ✅ File upload & processing
- ✅ AI chat functionality
- ✅ Session management
- ✅ Modern React UI

## 🎯 Use Cases

Perfect untuk:
- **Rapid Prototyping** - Quick YouTube analysis demos
- **Educational Purpose** - Learning YouTube API integration
- **Personal Use** - Simple content analysis tool
- **MVP Development** - Core functionality testing
- **Local Deployment** - Self-hosted solution

## 🛠️ Development

### Backend
```bash
# Development mode
npm run dev

# Build
npm run build

# Production
npm start

# Type check
npm run type-check
```

### Frontend  
```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🐛 Troubleshooting

### Common Issues
1. **Dependencies Error**: Install ytdl-core dan ffmpeg-static
2. **CORS Error**: Check CORS_ORIGIN di .env
3. **File Upload Fail**: Verify file size < 100MB
4. **Chat Not Working**: Ensure OpenAI API key valid

### Fallback Mode
System dirancang dengan graceful fallbacks:
- YouTube analysis tanpa ytdl-core = mock responses
- Chat tanpa OpenAI = predefined responses  
- File processing tanpa FFmpeg = basic analysis

## 📦 Deployment

### Docker (Coming Soon)
```bash
# Build images
docker-compose build

# Start services  
docker-compose up -d
```

### Manual Deployment
1. Build both backend dan frontend
2. Setup environment variables
3. Start backend server
4. Serve frontend static files

## 🤝 Contributing

Ini adalah versi "intinya aja dongs" jadi keep it simple! 

1. Fork the repo
2. Create feature branch
3. Keep changes minimal & focused
4. Test thoroughly
5. Submit PR

## 📄 License

Same as main VibelyTube project.

---

**Intinya aja dongs!** - Fokus ke yang penting, buang yang ribet! 🎉
