import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, FileText, Brain, Loader } from 'lucide-react';
import { useAppState } from '../context/AppState';

export const NovaAI: React.FC = () => {
  const { messages, addMessage, documents, addToast } = useAppState();
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { label: "Analyze my cognitive biases", text: "Identify my primary cognitive bias tags based on my project submissions." },
    { label: "What is my developer superpower?", text: "Analyze my developer baseline archetype and core stack superpower." },
    { label: "Check my synchronization logs", text: "Summarize the update frequency and credentials mapping completeness." }
  ];

  // Auto-scroll chat feed
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User query bubble
    addMessage(text, 'user');
    setQuery('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/nova/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      
      setIsTyping(false);
      
      if (response.ok) {
        // Handle both standard JSON formats (just in case the ApiResponse wrapper gets added later)
        if (data.success && data.data) {
           addMessage(data.data.answer, 'ai', data.data.sources);
        } else {
           addMessage(data.answer || "I could not generate an answer.", 'ai', data.sources || []);
        }
      } else {
        addMessage(data.message || 'I encountered an error trying to process your request.', 'ai');
      }
    } catch (err) {
      console.error('Nova AI Error:', err);
      setIsTyping(false);
      addMessage('Network error communicating with Nova AI.', 'ai');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(query);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] w-full max-w-4xl mx-auto relative bg-white pb-6">
      
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-50 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100/50 shadow-sm shrink-0">
            <Brain className="w-5 h-5 text-brand-purple" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              Nova AI
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
            </h2>
            <p className="text-[10px] font-semibold text-slate-400">Personal Identity Consultant</p>
          </div>
        </div>

        {/* Ambient indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/50 border border-purple-100/30 text-[10px] font-bold text-brand-purple uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          Mapping Active
        </div>
      </header>

      {/* Chat History Viewport */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-6 pr-2">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Sender Label */}
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-2">
              {msg.sender === 'user' ? 'Linguistic Baseline Query' : 'Nova Synthesis'}
            </span>

            {/* Bubble */}
            <div 
              className={`rounded-2xl px-5 py-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-50 border border-slate-100 text-slate-800 font-semibold'
                  : 'bg-transparent text-slate-700 space-y-3 px-0 py-0'
              }`}
            >
              {msg.sender === 'user' ? (
                msg.text
              ) : (
                <div className="space-y-4">
                  {/* Formatted response text */}
                  <div className="whitespace-pre-line font-medium leading-relaxed bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
                    {msg.text}
                  </div>

                  {/* Render citations if present */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">References:</span>
                      {msg.citations.map((cite, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 cursor-pointer hover:border-slate-200"
                          onClick={() => addToast(`Opening referenced file: ${cite}`, 'info')}
                        >
                          <FileText className="w-3 h-3 text-slate-400" />
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-[9px] font-semibold text-slate-300 mt-1.5 px-2">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Streaming Loading/Typing State */}
        {isTyping && (
          <div className="flex flex-col mr-auto items-start max-w-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-2">Nova Synthesizing</span>
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex items-center gap-3">
              <Loader className="w-4 h-4 text-brand-purple animate-spin" />
              <span className="text-xs font-semibold text-slate-500">Retrieving digital timeline links...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length < 3 && !isTyping && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar shrink-0 pb-4">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug.text)}
              className="px-4 py-2.5 bg-white border border-slate-100 hover:border-brand-purple/20 hover:bg-purple-50/10 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-all shrink-0 whitespace-nowrap"
            >
              {sug.label}
            </button>
          ))}
        </div>
      )}

      {/* Query input field bar */}
      <div className="shrink-0 relative">
        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.6)] focus-within:border-brand-purple/40 focus-within:bg-white focus-within:shadow-[0_10px_30px_-8px_rgba(139,92,246,0.1)] transition-all duration-300">
          
          <button 
            type="button" 
            onClick={() => addToast('Mic baseline sync active...', 'info')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Query your profile baseline..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-semibold text-slate-800 px-3 placeholder-slate-400"
          />

          <button
            onClick={() => handleSend(query)}
            disabled={!query.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm focus:outline-none transition-all ${
              query.trim()
                ? 'bg-gradient-to-tr from-brand-blue to-brand-purple cursor-pointer scale-100'
                : 'bg-slate-200 cursor-not-allowed scale-95 opacity-50'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
