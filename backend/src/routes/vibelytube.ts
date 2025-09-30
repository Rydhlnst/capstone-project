import express, { Request, Response } from 'express';
import multer from 'multer';
import { YouTubeService } from '../services/youtubeService';
import { ChatService } from '../services/chatService';

const router = express.Router();

// Lazy initialization of services (after env vars are loaded)
let youtubeService: YouTubeService;
let chatService: ChatService;

function initializeServices() {
  if (!youtubeService) {
    console.log('🔄 Initializing services with environment variables...');
    youtubeService = new YouTubeService();
    chatService = new ChatService();
  }
}

// In-memory session storage (for development)
const sessions = new Map<string, any>();

// Setup multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio, video, and document files
    const allowedTypes = ['audio/', 'video/', 'application/pdf', 'text/'];
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

/**
 * POST /api/vibelytube/analyze
 * Analyze YouTube video and save analysis
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    // Initialize services with loaded environment variables
    initializeServices();
    
    const { url, sessionId } = req.body;
    
    if (!url || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: url, sessionId'
      });
    }
    
    console.log(`📺 Starting YouTube analysis: ${url}`);
    
    // Analyze YouTube video using comprehensive pipeline
    const analysis = await youtubeService.analyzeVideo(url);
    
    // Store analysis in session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { conversationHistory: [], analyses: [] });
      console.log(`🆕 Created new session: ${sessionId}`);
    }
    
    const session = sessions.get(sessionId);
    const analysisId = `analysis_${Date.now()}`;
    const analysisData = {
      id: analysisId,
      ...analysis,
      analyzedAt: new Date().toISOString()
    };
    
    session.analyses.push(analysisData);
    
    console.log(`💾 Stored analysis in session:`);
    console.log(`   - Analysis ID: ${analysisId}`);
    console.log(`   - Video title: ${analysis.title}`);
    console.log(`   - Transcript length: ${analysis.transcript?.length || 0}`);
    console.log(`   - Total analyses in session: ${session.analyses.length}`);
    
    console.log(`✅ YouTube analysis completed for session: ${sessionId}`);
    console.log(`📊 Analysis result - Title: ${analysis.title}`);
    
    const responseData = {
      id: analysisId,
      title: analysis.title,
      description: analysis.description,
      duration: analysis.duration,
      viewCount: analysis.viewCount,
      likeCount: analysis.likeCount,
      channelTitle: analysis.channelTitle,
      transcript: analysis.transcript,
      thumbnailUrl: analysis.thumbnailUrl,
      url: analysis.url,
      processedAt: new Date().toISOString()
    };
    
    console.log(`🚀 Sending response to frontend with title: ${responseData.title}`);
    
    res.json({
      success: true,
      data: responseData
    });
    
  } catch (error: any) {
    console.error('❌ YouTube analysis error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error during YouTube analysis',
      details: error.message
    });
  }
});

/**
 * POST /api/vibelytube/chat
 * Send message and get AI response with analysis context
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    // Initialize services with loaded environment variables
    initializeServices();
    
    const { message, sessionId, analysisId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: message, sessionId'
      });
    }
    
    console.log(`💬 Processing chat message for session: ${sessionId}`);
    console.log(`📄 Analysis ID provided: ${analysisId}`);
    console.log(`💭 User message: ${message}`);
    
    // Get or create session
    if (!sessions.has(sessionId)) {
      console.log(`🆕 Creating new session: ${sessionId}`);
      sessions.set(sessionId, { conversationHistory: [], analyses: [] });
    }

    const session = sessions.get(sessionId);
    let conversationHistory = session.conversationHistory || [];
    
    console.log(`📊 Session info:`);
    console.log(`   - Total analyses: ${session.analyses.length}`);
    console.log(`   - Available analysis IDs: [${session.analyses.map((a: any) => a.id).join(', ')}]`);
    console.log(`   - Looking for analysis ID: ${analysisId}`);
    
    // If there's an analysis ID, include the video data as context
    if (analysisId) {
      console.log(`📄 Including analysis context: ${analysisId}`);
      console.log(`📊 Session analyses count: ${session.analyses.length}`);
      
      // First try exact match, then try partial match for backwards compatibility
      let analysis = session.analyses.find((a: any) => a.id === analysisId);
      
      // If no exact match, try to find by ID suffix or alternative matching
      if (!analysis && session.analyses.length > 0) {
        // Try last analysis if analysisId contains similar pattern
        analysis = session.analyses[session.analyses.length - 1];
        console.log(`🔄 Using latest analysis as fallback: ${analysis.id}`);
      }
      
      console.log(`🔍 Found analysis: ${!!analysis}`);
      
      if (analysis) {
        console.log(`📹 Video title: ${analysis.title}`);
        console.log(`📝 Transcript length: ${analysis.transcript?.length || 0}`);
        
        // Add system context about the video with Cecep personality
        const systemMessage = {
          role: 'system',
          content: `Kamu adalah Cecep, chatbot yang santai dan casual. Kamu sedang membahas video YouTube berikut:
          
Judul: ${analysis.title}
Channel: ${analysis.channelTitle || 'Tidak diketahui'}
Durasi: ${analysis.duration}
Deskripsi: ${analysis.description || 'Tidak ada deskripsi'}

${analysis.transcript ? `Transkrip lengkap video:
${analysis.transcript}` : 'Transkrip tidak tersedia.'}

PENTING: Gunakan kepribadian Cecep yang santai, casual, dan ramah. Gunakan bahasa gaul Indonesia dan jawab berdasarkan konten video di atas. Jangan gunakan fallback response umum. Selalu merujuk ke isi video yang sudah kamu analisis.`
        };
        
        console.log(`📋 System message content preview: ${systemMessage.content.substring(0, 200)}...`);
        
        // Only add system message if it's not already there
        if (!conversationHistory.some((msg: any) => msg.role === 'system' && msg.content.includes(analysis.title))) {
          conversationHistory.unshift(systemMessage);
          console.log(`✅ Added system message to conversation`);
        } else {
          console.log(`⚠️ System message already exists in conversation`);
        }
      } else {
        console.log(`❌ Analysis not found in session. Available analyses:`, session.analyses.map((a: any) => a.id));
      }
    } else {
      console.log(`⚠️ No analysisId provided in chat request`);
    }

    // Add user message to history
    const userMessage = { role: 'user', content: message };
    conversationHistory.push(userMessage);
    
    // Generate AI response
    const aiResponse = await chatService.generateResponse(conversationHistory);
    
    // Add AI response to history
    const assistantMessage = { role: 'assistant', content: aiResponse };
    conversationHistory.push(assistantMessage);
    
    // Update session with new conversation
    session.conversationHistory = conversationHistory;
    
    console.log(`✅ Chat response generated for session: ${sessionId}`);
    
    res.json({
      success: true,
      data: {
        response: aiResponse,
        conversationHistory: conversationHistory.filter((msg: any) => msg.role !== 'system')
      }
    });
    
  } catch (error: any) {
    console.error('❌ Chat error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error during chat',
      details: error.message
    });
  }
});

/**
 * GET /api/vibelytube/session/:sessionId
 * Get session information
 */
router.get('/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const conversationHistory = session.conversationHistory || [];
    
    res.json({
      success: true,
      data: {
        sessionId,
        conversationHistory: conversationHistory.filter((msg: any) => msg.role !== 'system')
      }
    });
    
  } catch (error: any) {
    console.error('❌ Session info error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/vibelytube/session
 * Create new session
 */
router.post('/session', (req: Request, res: Response) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    sessions.set(sessionId, {
      conversationHistory: [],
      analyses: [],
      createdAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: {
        sessionId
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating session:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Gagal membuat session',
      details: error.message
    });
  }
});

/**
 * GET /api/vibelytube/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'Intinya aja dongs Backend',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
