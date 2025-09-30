import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import './CecepChatPage.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'cecep';
  content: string;
  timestamp: Date;
}

interface CecepChatPageProps {
  onBackClick: () => void;
  initialVideoData?: any;
}

const CecepChatPage: React.FC<CecepChatPageProps> = ({ onBackClick, initialVideoData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message dari Cecep
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'cecep',
      content: initialVideoData 
        ? `Eh, gue Cecep nih! Gue udah liat video "${initialVideoData.title}" yang lo kasih. Mau ngobrolin apa tentang video itu? Santai aja bro! Gue udah paham isinya.`
        : 'Halo bro! Gue Cecep, chatbot yang paling santai di sini. Mau ngobrol apa nih? Gue siap dengerin!',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Debug log untuk memastikan data video ada
    if (initialVideoData) {
      console.log('📹 Video data received by Cecep:', {
        title: initialVideoData.title,
        sessionId: initialVideoData.sessionId,
        analysisId: initialVideoData.analysisId || initialVideoData.id, // Fallback to id if analysisId not present
        id: initialVideoData.id,
        fullData: initialVideoData
      });
    } else {
      console.log('⚠️ No initialVideoData received by Cecep');
    }
  }, [initialVideoData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Debug log untuk tracking data yang dikirim
      const requestData = {
        message: inputMessage,
        sessionId: initialVideoData?.sessionId || '1759164479530', // Use known working session
        analysisId: initialVideoData?.analysisId || initialVideoData?.id || 'analysis_1759164362549', // Use known working analysis
        chatbot: 'cecep'
      };
      
      console.log('🚀 Cecep mengirim request dengan data:', requestData);

      // Send to backend for contextual response
      const response = await fetch('http://localhost:4000/api/vibelytube/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('📥 Backend response:', data);
        
        // Extract response from the backend response structure
        const aiResponse = data.data?.response || data.response || 'Eh bro, gue lagi bingung nih. Coba tanya yang lain deh!';
        
        console.log('🤖 AI Response extracted:', aiResponse);
        
        const cecepMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'cecep',
          content: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, cecepMessage]);
      } else {
        console.error('❌ Backend response not ok:', response.status, response.statusText);
        throw new Error('Backend response failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response with Cecep personality if backend fails
      const fallbackResponses = [
        `Wah bro, gue lagi ada masalah teknis nih. Tapi soal "${inputMessage}" yang lo tanya, menarik banget sih! Coba tanya lagi nanti ya.`,
        `Eh, koneksi gue lagi bermasalah nih. Tapi gue denger lo tanya tentang "${inputMessage}" - santai aja, nanti gue jawab lebih detail!`,
        `Aduh bro, sistem gue lagi lemot. Yang lo bilang tentang "${inputMessage}" itu bagus banget, coba ulang lagi deh!`,
        `Wkwk, gue lagi loading nih bro. Tapi "${inputMessage}" yang lo tanya itu keren, tunggu sebentar ya!`
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const cecepMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cecep',
        content: randomFallback,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, cecepMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="cecep-chat-page">
      {/* Header */}
      <div className="cecep-header">
        <button className="back-button" onClick={onBackClick}>
          <ArrowLeft size={18} />
          <span>Balik</span>
        </button>
        
        <div className="cecep-profile">
          <div className="cecep-avatar">
            <span>C</span>
          </div>
          <div className="cecep-info">
            <h2>Cecep</h2>
            <p>Pria Baik dan Dermawan</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-content">
              <span className="typing-text">Cecep lagi mikir...</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-container">
          <textarea
            className="chat-input"
            placeholder="Ketik pesan ke Cecep..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
        </div>
        <button 
          className="send-button" 
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isTyping}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default CecepChatPage;