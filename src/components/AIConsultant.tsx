import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Zap, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AI_KNOWLEDGE } from '../constants';
import { INITIAL_GREETING } from '../constants';
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
        ? "【进阶模式已激活】现在我将利用“战术仿真矩阵”为您解析事件卡、上帝干预及高阶博弈策略。" 
        : "【基础模式已激活】我们将专注于基础细胞交互、角色能力及游戏核心流程的解析。" 
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: isAdvancedMode 
            ? "你是《免疫战争》进阶战术助手。回答关于事件卡、上帝干预和高阶推理逻辑的问题。结合本地战术库，提供有深度的建议。"
            : "你是《免疫战争》基础助手。回答关于角色能力、胜负条件和基础流程的问题。简洁明了。",
        }
      });

      const replyText = response.text || "通信异常，无法解析生物信号。";
      setMessages(prev => [...prev, { role: 'model', text: replyText }]);
      soundEngine.playImmuneAlert();
    } catch (error) {
      console.error(error);
      // 降级回滚：使用本地匹配逻辑
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
          reply = "本地分析终端暂未匹配到相关指令，请尝试换一种说法。";
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
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isAdvancedMode ? 'Advanced Ops' : 'Basic Logic'}</span>
          </div>
        </div>
        <button onClick={toggleMode} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${isAdvancedMode ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
          {isAdvancedMode ? <Zap size={14} className="fill-current" /> : <Info size={14} />}
          {isAdvancedMode ? '进阶模式' : '基础模式'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-md animate-fade-in ${
              msg.role === 'user' 
                ? (isAdvancedMode ? 'bg-rose-600' : 'bg-bio-primary') + ' text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 px-2">
            <Loader2 className={`w-4 h-4 animate-spin ${isAdvancedMode ? 'text-rose-400' : 'text-bio-primary'}`} />
            <span className="text-[10px] font-black uppercase opacity-50 tracking-tighter">Processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-white/5">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isAdvancedMode ? "输入战术指令（潜伏期、事件卡、上帝）..." : "询问规则（如：人数、感染、如何获胜）..."} className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bio-primary placeholder:text-slate-700" />
          <button onClick={handleSend} disabled={isLoading} className={`p-3 rounded-xl transition-all ${isAdvancedMode ? 'bg-rose-600' : 'bg-bio-primary'}`}><Send size={20} className="text-white" /></button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
