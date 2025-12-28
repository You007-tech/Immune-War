import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Zap, Info, ShieldCheck } from 'lucide-react';
import { INITIAL_GREETING, AI_KNOWLEDGE } from '../constants';
import { soundEngine } from './SoundEngine';

const AIConsultant: React.FC = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
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

  const toggleMode = () => {
    const nextMode = !isAdvancedMode;
    setIsAdvancedMode(nextMode);
    soundEngine.playPhaseTransition();
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: nextMode 
        ? "【模式切换】已激活进阶战术顾问模式。现在我将针对事件卡、上帝干预等高阶博弈机制提供指导。" 
        : "【模式切换】已回到基础战术模式。我们将专注于基础细胞交互与角色核心能力的分析。" 
    }]);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    soundEngine.playPhaseTransition();

    // 仿真离线计算延迟
    setTimeout(() => {
      let reply = "";
      
      // 搜索对应模式的知识库
      const currentKnowledge = isAdvancedMode ? AI_KNOWLEDGE.ADVANCED : AI_KNOWLEDGE.BASIC;
      
      // 模糊匹配逻辑
      const match = currentKnowledge.find(k => 
        k.keywords.some(kw => userMessage.toLowerCase().includes(kw.toLowerCase()))
      );
      
      if (match) {
        reply = match.response;
      } else {
        // 如果当前模式未找到，尝试在另一个模式找
        const otherKnowledge = isAdvancedMode ? AI_KNOWLEDGE.BASIC : AI_KNOWLEDGE.ADVANCED;
        const otherMatch = otherKnowledge.find(k => 
          k.keywords.some(kw => userMessage.toLowerCase().includes(kw.toLowerCase()))
        );

        if (otherMatch) {
          reply = `检测到跨模式指令。${otherMatch.response}\n\n(提示：您当前处于${isAdvancedMode ? '进阶' : '基础'}模式，已为您从全局库检索)`;
        } else {
          reply = isAdvancedMode 
            ? "进阶逻辑扫描中... 建议针对“事件卡”对座位流动性的影响进行深度提问。"
            : "生物特征分析中... 目前机体稳态维持较好，您可以尝试询问“如何获胜”、“感染逻辑”或“角色能力”。";
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      setIsLoading(false);
      soundEngine.playImmuneAlert();
    }, 800);
  };

  return (
    <div className={`flex flex-col h-[700px] glass-card rounded-[2rem] overflow-hidden shadow-2xl border transition-all duration-500 ${isAdvancedMode ? 'border-rose-500/40 shadow-rose-900/10' : 'border-bio-primary/20'}`}>
      <div className="px-6 py-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className={isAdvancedMode ? 'text-rose-400' : 'text-bio-highlight'} size={24} />
          <div className="flex flex-col">
            <span className="font-bold tracking-widest text-sm uppercase">AI 战术顾问</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">{isAdvancedMode ? 'Advanced Simulation' : 'Basic Logic'}</span>
          </div>
        </div>
        <button 
          onClick={toggleMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 ${
            isAdvancedMode 
              ? 'bg-rose-600 text-white shadow-rose-900/40' 
              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          {isAdvancedMode ? <Zap size={14} className="fill-current" /> : <Info size={14} />}
          {isAdvancedMode ? '进阶模式' : '基础模式'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg animate-fade-in ${
              msg.role === 'user' 
                ? (isAdvancedMode ? 'bg-rose-600 text-white' : 'bg-bio-primary text-white') + ' rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 px-2">
            <Loader2 className={`w-4 h-4 animate-spin ${isAdvancedMode ? 'text-rose-400' : 'text-bio-primary'}`} />
            <span className="text-xs font-bold tracking-tighter uppercase opacity-50">Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAdvancedMode ? "输入进阶战术关键字（事件、上帝、潜伏期）..." : "下达战术指令（如：如何获胜、治愈、换座）..."}
            className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bio-primary placeholder:text-slate-600 transition-all"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading} 
            className={`p-3 rounded-xl transition-all active:scale-90 disabled:opacity-50 ${isAdvancedMode ? 'bg-rose-600' : 'bg-bio-primary'}`}
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
