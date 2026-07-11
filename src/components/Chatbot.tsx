import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, UserCheck, Sparkles, Loader, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialMessage?: string;
}

export default function Chatbot({ isOpen, setIsOpen, initialMessage }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: initialMessage || 'Hello! How can we assist with your solar infrastructure needs today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update welcome message if initialMessage changes dynamically
  useEffect(() => {
    if (initialMessage) {
      setMessages((prev) => {
        // If first message is welcome and text differs, update it
        if (prev.length > 0 && prev[0].id === 'welcome') {
          return [
            {
              ...prev[0],
              text: initialMessage,
            },
            ...prev.slice(1),
          ];
        }
        return prev;
      });
    }
  }, [initialMessage]);

  // Scroll to bottom whenever messages list updates or chat opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-open chatbot after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setIsOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages, // pass history for context
        }),
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I'm having a little trouble connecting. How can I help you regarding solar energy?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error contacting support chatbot:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Our expert advisors are currently offline, but we would love to review your configuration. Please fill out our brief consultation request form in the Contact section!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-80 md:w-96 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="bg-deep-navy text-soft-white p-4 flex justify-between items-center border-b border-sky-blue/20 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-warm-gold animate-pulse" />
                <span className="font-bold text-sm tracking-wide">Power Pulse Support</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-signature btn-ghost-inverted p-2"
                aria-label="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-deep-navy flex items-center justify-center text-warm-gold shadow-sm flex-shrink-0 mt-0.5">
                      <UserCheck className="h-4 w-4" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`p-3 rounded-lg text-sm shadow-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-warm-gold text-deep-navy font-medium rounded-br-none'
                          : 'bg-white text-slate-gray border border-sky-blue/10 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot Loading Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-10 h-10 rounded-full bg-sky-blue/20 flex items-center justify-center border border-sky-blue/30 flex-shrink-0 shadow-inner mt-0.5">
                    <UserCheck className="h-7 w-7 text-deep-navy" />
                  </div>
                  <div className="bg-white text-slate-gray p-3 rounded-lg rounded-tl-none text-sm border border-sky-blue/10 flex items-center gap-2 max-w-[75%]">
                    <Loader className="h-4 w-4 animate-spin text-deep-navy" />
                    <span>Advisor is analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form Input Line */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-deep-navy text-deep-navy focus:bg-white transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-deep-navy text-soft-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors shadow-soft"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 items-center shrink-0">
        {/* WhatsApp Support Button */}
        <motion.a
          href="https://wa.me/1234567890?text=I%20am%20interested%20in%20PowerPulse%20solar%20solutions%20and%20support!"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 shrink-0 p-0 border-none rounded-2xl btn-signature flex items-center justify-center text-white bg-[#25D366] shadow-2xl hover:bg-[#20ba59] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-emerald-500/30 relative"
          aria-label="WhatsApp Support"
          animate={{
            boxShadow: [
              '0px 4px 20px rgba(37, 211, 102, 0.4)',
              '0px 4px 30px rgba(37, 211, 102, 0.6)',
              '0px 4px 20px rgba(37, 211, 102, 0.4)',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" className="shrink-0 block">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </motion.a>

        {/* Floating Action Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-primary btn-signature shadow-2xl h-16 w-16 shrink-0 p-0 border-none rounded-2xl relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-deep-navy shrink-0 block">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-deep-navy shrink-0 block">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
          {/* Active notification badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-deep-navy rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
