import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { INITIAL_GREETING } from '../constants';
import { soundEngine } from './SoundEngine';

// 本地战术库
const LOCAL_KNOWLEDGE = [
  { keywords: ['赢', '获胜', '怎么玩', '胜利'], response: "根据博弈模型：免疫阵营需建立多点巡逻，通过换座打乱病毒的潜伏序列；病毒阵营需利用“细胞记忆”空档期进行链式感染。" },
  { keywords: ['病毒', '感染', '潜伏'], response: "监测到病毒信号。病毒的制胜关键在于‘社交工程’——在换座方案表决中诱导指挥者，将自己安插在健康的体细胞群落旁。" },
  { keywords: ['免疫', '医生', '细胞', '治愈'], response: "免疫细胞是唯一的治愈手段。建议在第二轮后，通过排除法锁定高疑点目标，利用换座机制强制与其对坐进行‘治愈清理’。" },
  { keywords: ['换座', '指挥者', '方案'], response: "换座是防御屏障的重组。如果方案被否决两次，第三任指挥者将拥有绝对分配权，这是逆转局势的关键机会。" },
  { keywords: ['规则', '机制'], response: "核心机制模拟真实免疫：治愈代表特异性识别，感染代表病毒的溶源性转换。这是微观世界每秒都在发生的战争。" }
];

const DEFAULT_RESPONSES = [
  "正在通过生物特征识别分析当前博弈趋势...",
  "战术矩阵扫描中：建议密切监控最近执行换座动作的玩家。",
  "监测到异常代谢反应，疑似病毒正在尝试进行身份隐藏。",
  "免疫记忆响应正常，目前机体稳态评级：良好。",
  "指挥官，当前的社交矩阵分布存在结构性风险，建议调整防御策略。"
];

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

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    soundEngine.playPhaseTransition();

    // 模拟本地计算延迟，让它看起来像在思考
    setTimeout(() => {
      let reply = "";
      const match = LOCAL_KNOWLEDGE.find(k => k.keywords.some(kw => userMessage.toLowerCase().includes(kw)));
      
      if (match) {
        reply = match.response;
      } else {
        reply = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
      }

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      setIsLoading(false);
      soundEngine.playImmuneAlert();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[650px] glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-bio-primary/20">
      <div className="px-6 py-4 border-b border-bio-primary/20 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-bio-highlight animate-pulse" size={20} />
          <span className="font-bold tracking-widest text-sm uppercase">本地战术仿真终端</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">离线加密模式</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-lg animate-fade-in ${
              msg.role === 'user' ? 'bg-bio-primary text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center gap-3 text-bio-primary px-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold tracking-tighter">分析中...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入关键词进行仿真分析..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bio-primary placeholder:text-slate-600 transition-all"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading} 
            className="bg-bio-primary p-3 rounded-xl hover:bg-bio-highlight transition-all active:scale-90 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
