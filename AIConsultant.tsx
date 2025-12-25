
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_GREETING } from '../constants';
import { soundEngine } from './SoundEngine';

const AIConsultant: React.FC = () => {
  // Fix: Removed apiKey state and localStorage logic as per guidelines.
  // The API key must be obtained exclusively from process.env.API_KEY.
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: INITIAL_GREETING }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    // Fix: Removed dependency on local apiKey state.
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    soundEngine.playPhaseTransition();

    try {
      // Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: "你是一款名为“免疫战争”的桌游助手。口吻专业。禁止使用Markdown加粗或列表符号。请使用纯文本分段回复。结合生物学解释游戏机制。"
        }
      });
      
      // Fix: Use response.text property directly.
      const reply = response.text || "系统信号弱，未生成有效答复。";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      soundEngine.playImmuneAlert();

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "警告：神经网络突触连接中断。请检查网络环境或确认系统配置。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Removed the conditional rendering for API key input UI.
  return (
    <div className="flex flex-col h-[650px] bg-slate-900 rounded-[2rem] border border-bio-primary/20 shadow-3xl overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-r from-bio-primary/10 to-transparent p-6 border-b border-bio-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-bio-primary/20 rounded-2xl">
            <Bot className="w-6 h-6 text-bio-highlight" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight">战术生物学家 (AI)</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">神经同步已激活</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] rounded-[1.5rem] p-4 shadow-xl ${
              msg.role === 'user' ? 'bg-bio-primary text-white rounded-br-none' : 'bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-black uppercase tracking-widest">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? '指挥官' : '系统终端'}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/40 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-bio-primary" />
              <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">处理生物信号中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-950/80 border-t border-slate-800/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="下达查询指令..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-bio-primary"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-bio-primary hover:bg-sky-500 disabled:opacity-50 text-white w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
