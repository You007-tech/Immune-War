import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, ShieldAlert } from 'lucide-react';
import { INITIAL_GREETING } from './constants';
import { soundEngine } from './SoundEngine';

const AIConsultant: React.FC = () => {
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
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    soundEngine.playPhaseTransition();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('网络防御链路中断');

      const data = await response.json();
      const reply = data.text || "通信异常，无法解析生物信号。";
      
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      soundEngine.playImmuneAlert();

    } catch (error: any) {
      console.error("AI Proxy Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "警告：中枢神经连接中断。请检查后端代理配置及 API 密钥有效性。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] glass-card rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-bio-primary/20 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="text-bio-highlight" />
          <span className="font-bold">战术指挥终端</span>
        </div>
        <ShieldAlert size={16} className="text-bio-primary" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' ? 'bg-bio-primary text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Loader2 className="w-5 h-5 animate-spin text-bio-primary" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-950/60 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="下达查询指令..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-bio-primary"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-bio-primary p-2 rounded-xl">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
