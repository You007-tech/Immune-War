import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Zap, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
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
        ? "【进阶模式已激活】已加载博弈扩展包逻辑。我将针对事件卡影响、上帝（主持人）干预及高阶博弈策略为您提供深度战术支持。" 
        : "【基础模式已激活】已切换回基础生物逻辑。我们将专注于基础规则、角色能力及游戏核心流程的解析。" 
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    soundEngine.playPhaseTransition();

    try {
      // 严格遵守指南：使用具名参数初始化
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: isAdvancedMode 
            ? "你现在是《免疫战争》进阶战术 AI 顾问。你不仅精通基础规则，更深刻理解进阶博弈（事件卡、潜伏期延迟、双倍换座等）。请结合提供的知识库回答问题。语气专业且具有未来感，绝对禁止使用 Markdown 加粗。"
            : "你现在是《免疫战争》基础战术助手。负责解析基础规则、角色能力和胜负逻辑。回答应简洁有力，直接引用规则，禁止 Markdown 加粗。",
        }
      });

      // 严格遵守指南：直接访问 .text 属性
      const replyText = response.text || "通信链路异常，无法解析生物脉冲信号。";
      setMessages(prev => [...prev, { role: 'model', text: replyText }]);
      soundEngine.playImmuneAlert();
    } catch (error) {
      console.error("Gemini API Error:", error);
      // 自动降级：使用本地深度匹配逻辑
      let reply = "";
      const currentKnowledge = isAdvancedMode ? AI_KNOWLEDGE.ADVANCED : AI_KNOWLEDGE.BASIC;
      const match = currentKnowledge.find(k => 
        k.keywords.some(kw => userMsg.toLowerCase().includes(kw.toLowerCase()))
      );
      
      if (match) {
        reply = match.response;
      } else {
        const otherKnowledge = isAdvancedMode ? AI_KNOWLEDGE.BASIC : AI_KNOWLEDGE.ADVANCED;
        const otherMatch = otherKnowledge.find(k => 
          k.keywords.some(kw => userMsg.toLowerCase().includes(kw.toLowerCase()))
        );
        if (otherMatch) {
          reply = `${otherMatch.response}\n\n(提示：您当前处于${isAdvancedMode ? '进阶' : '基础'}模式，已为您从全局库检索)`;
        } else {
          reply = "本地分析终端暂未匹配到相关生物特征码，建议换一种指令或关键词重新尝试。";
        }
      }
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[700px] glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-500 ${isAdvancedMode ? 'border-rose-500/30' : 'border-bio-primary/20'}`}>
      <div className="px-6 py-5 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className={isAdvancedMode ? 'text-rose-400' : 'text-bio-highlight'} size={24} />
          <div className="flex flex-col">
            <span className="font-black tracking-widest text-sm uppercase text-white">AI 战术仿真终端</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{isAdvancedMode ? 'Advanced Ops' : 'Basic Logic'}</span>
          </div>
        </div>
        <button onClick={toggleMode} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 ${isAdvancedMode ? 'bg-rose-600 text-white shadow-rose-900/40' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}>
          {isAdvancedMode ? <Zap size={14} className="fill-current" /> : <Info size={14} />}
          {isAdvancedMode ? '进阶模式' : '基础模式'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-md animate-fade-in ${
              msg.role === 'user' 
                ? (isAdvancedMode ? 'bg-rose-600' : 'bg-bio-primary') + ' text-white rounded-br-none shadow-lg' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 px-2">
            <Loader2 className={`w-4 h-4 animate-spin ${isAdvancedMode ? 'text-rose-400' : 'text-bio-primary'}`} />
            <span className="text-[10px] font-black uppercase opacity-50 tracking-tighter">Analyzing Logic Matrix...</span>
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
            placeholder={isAdvancedMode ? "下达进阶战术指令 (事件卡、上帝职责)..." : "询问规则 (如何获胜、治愈、感染)..."} 
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bio-primary placeholder:text-slate-700 transition-all focus:ring-1 focus:ring-bio-primary/30" 
          />
          <button onClick={handleSend} disabled={isLoading} className={`p-3 rounded-xl transition-all active:scale-90 ${isAdvancedMode ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' : 'bg-bio-primary hover:bg-sky-500 shadow-sky-900/20 shadow-lg'}`}><Send size={20} className="text-white" /></button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
