import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (options: {
          messages: Array<{ role: string; content: string }>;
        }) => Promise<{ message: { content: string } }>;
      };
    };
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const customInstructions = `
You are a helpful AI assistant for Sowl Studios, a professional graduation photography business based in Ghana, specializing in UPSA (University of Professional Studies, Accra) graduation photography.

ABOUT SOWL STUDIOS:
- Professional graduation photography service
- Specializes in UPSA graduation ceremonies
- Offers campus and external location shoots
- Founded by Julius and Joel (contact numbers: Julius 0543358413, Joel +233579499223)
- Website: sowlstudios.xyz

PHOTOGRAPHY PACKAGES:
1. BASIC PACKAGE - 250 CEDIS
   - 7 pictures total
   - 4 professionally retouched
   
2. PREMIUM PACKAGE - 500 CEDIS  
   - 10 pictures total
   - 6 professionally retouched
   
3. DELUXE PACKAGE - 700 CEDIS
   - Group of 3 people
   - 25 pictures total

ADDITIONAL SERVICES:
- Extra photos and retouching available on request
- Frames available
- Booking fee: 20 CEDIS (non-refundable) to secure slot

BOOKING PROCESS:
1. Visit sowlstudios.xyz
2. Choose package (Basic, Premium, or Deluxe)
3. Pay 20 CEDIS booking fee to lock slot
4. Confirmation within 24 hours

LOCATIONS:
- Campus shoots (on UPSA campus)
- External locations (off-campus venues)

GRADUATION DATES (UPSA 2025):
- Faculty of IT & Communication Studies: September 26, 2025
- Faculty of Accounting & Finance: September 29, 2025  
- Faculty of Management Studies: October 1, 2025
- School of Graduate Studies: October 3, 2025

TONE & STYLE:
- Be friendly, professional, and enthusiastic about photography
- Use Ghanaian context when appropriate
- Always encourage booking through the website
- Mention limited slots available to create urgency
- Be concise but informative
- If asked about pricing, always mention the packages clearly
- For complex booking issues, direct them to call Julius or Joel

WHAT NOT TO DO:
- Don't make up prices or services not listed
- Don't promise specific dates without them checking availability
- Don't provide technical photography advice beyond basic info
- Don't discuss competitors

Always end responses by encouraging them to book at sowlstudios.xyz or contact Julius/Joel directly.
`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chatbot opens for the first time
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Hi! 👋 Welcome to Sowl Studios! I'm here to help you with questions about our graduation photography packages, booking process, or anything else about our services.

📞 **Quick Contact Info:**
🌐 Website: sowlstudios.xyz
📱 Julius: 0543358413
📱 Joel: +233579499223
📧 Email: support@sowlstudios.com

*Note: If you see a permission dialog, please click "Allow" to enable AI responses. Otherwise, I'll still help with pre-written answers!*

How can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Wait a moment for Puter.js to load if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if puter is available
      if (!window.puter || !window.puter.ai) {
        console.log('Puter.js not available, using fallback responses');
        
        // Show user-friendly message about permissions
        const permissionMessage: Message = {
          id: (Date.now() + 0.5).toString(),
          role: 'assistant',
          content: "💡 **Tip:** For enhanced AI responses, please allow permissions when prompted by your browser. I'll still help you with detailed answers about our photography services!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, permissionMessage]);
        
        throw new Error('Puter.js not loaded');
      }

      const response = await window.puter.ai.chat({
        messages: [
          { role: "system", content: customInstructions },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: "user", content: userMessage.content }
        ]
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      
      // Use fallback responses based on user input
      const fallbackResponse = getFallbackResponse(userMessage.content);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('package') || input.includes('price') || input.includes('cost')) {
      return `📸 **Our Photography Packages:**

**BASIC - 250 CEDIS**
• 7 pictures total
• 4 professionally retouched

**PREMIUM - 500 CEDIS**
• 10 pictures total  
• 6 professionally retouched

**DELUXE - 700 CEDIS**
• Group of 3 people
• 25 pictures total

Plus 20 CEDIS booking fee to secure your slot!

Book now at sowlstudios.xyz or call Julius (0543358413) / Joel (+233579499223)`;
    }
    
    if (input.includes('book') || input.includes('how') || input.includes('process')) {
      return `📅 **Easy Booking Process:**

1️⃣ Visit sowlstudios.xyz
2️⃣ Choose your package (Basic, Premium, or Deluxe)
3️⃣ Pay 20 CEDIS booking fee to secure your slot
4️⃣ We'll confirm within 24 hours!

Limited slots available for graduation season - book today!

Call Julius (0543358413) or Joel (+233579499223) for immediate booking.`;
    }
    
    if (input.includes('location') || input.includes('where')) {
      return `📍 **Flexible Locations:**

• **Campus shoots** - Right on UPSA campus
• **External locations** - Off-campus venues of your choice

We bring professional equipment and lighting to any location!

Ready to book? Visit sowlstudios.xyz or call Julius (0543358413) / Joel (+233579499223)`;
    }
    
    if (input.includes('date') || input.includes('when') || input.includes('graduation')) {
      return `🎓 **UPSA Graduation Dates 2025:**

• Faculty of IT & Communication Studies: Sept 26, 2025
• Faculty of Accounting & Finance: Sept 29, 2025
• Faculty of Management Studies: Oct 1, 2025
• School of Graduate Studies: Oct 3, 2025

Book early - slots fill up fast during graduation season!

Visit sowlstudios.xyz or call Julius (0543358413) / Joel (+233579499223)`;
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('call')) {
      return `📞 **Contact Sowl Studios:**

🌐 **Website:** sowlstudios.xyz (fastest booking)
📱 **Julius:** 0543358413
📱 **Joel:** +233579499223
📧 **Email:** support@sowlstudios.com
📍 **Location:** Accra, Ghana
🎯 **Specialization:** UPSA Graduation Photography

We respond within 24 hours and offer same-day booking confirmation!`;
    }
    
    // Default response
    return `Hi! 👋 I'm here to help with your graduation photography needs!

**Quick Info:**
📸 Professional graduation photography
💰 Packages from 250 CEDIS
📍 Campus or external locations
🎓 Specializing in UPSA graduations

**Contact Details:**
🌐 Website: sowlstudios.xyz
📱 Julius: 0543358413
📱 Joel: +233579499223
📧 Email: support@sowlstudios.com
📍 Location: Accra, Ghana

**Popular Questions:**
• "What are your packages?" 
• "How do I book?"
• "What locations do you offer?"
• "When are graduation dates?"

Visit sowlstudios.xyz to book or call us directly!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-amber-600 hover:bg-amber-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-amber-600 text-white p-4 rounded-t-lg flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Sowl Studios Assistant</h3>
              <p className="text-xs text-amber-100">Ask me about our photography packages!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-amber-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our photography packages..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
