
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Book, LayoutDashboard, MessageSquare, HeartPulse, GraduationCap, Volume2, VolumeX, Globe } from 'lucide-react';
import KnowledgeBase from './components/KnowledgeBase';
import GameAssistant from './components/GameAssistant';
import AIConsultant from './components/AIConsultant';
import { soundEngine } from './components/SoundEngine';

enum Tab {
  HOME = 'HOME',
  KNOWLEDGE = 'KNOWLEDGE',
  GAME = 'GAME',
  AI = 'AI'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const toggleAudio = () => {
    const newVal = !isAudioEnabled;
    setIsAudioEnabled(newVal);
    soundEngine.toggle(newVal);
    if (newVal) {
      soundEngine.playPhaseTransition();
    }
  };

  useEffect(() => {
    soundEngine.playPhaseTransition();
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-bio-primary blur-[120px] opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
              <ShieldCheck className="w-32 h-32 text-bio-primary relative z-10 mb-6 drop-shadow-[0_0_20px_rgba(14,165,233,0.6)] animate-pulse" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-bio-highlight via-white to-bio-accent">
              免疫战争
            </h1>
            <p className="text-2xl text-slate-300 font-light tracking-[0.2em] max-w-2xl uppercase">
              病毒潜伏战 <span className="text-bio-accent font-bold">LATENCY WAR</span>
            </p>
            <p className="max-w-xl text-slate-400 leading-relaxed text-lg">
              体验微观世界的博弈之美，通过节奏与策略理解生命防御系统，助力联合国 <span className="text-white font-semibold">SDGs</span> 全球可持续发展愿景。
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-green-900/40 border border-green-500/50 px-5 py-2.5 rounded-full text-green-400 text-sm font-bold backdrop-blur-sm shadow-lg shadow-green-900/20">
                 <HeartPulse size={18} className="animate-pulse" />
                 SDG 3: 良好健康与福祉
              </div>
              <div className="flex items-center gap-2 bg-red-900/40 border border-red-500/50 px-5 py-2.5 rounded-full text-red-400 text-sm font-bold backdrop-blur-sm shadow-lg shadow-red-900/20">
                 <GraduationCap size={18} />
                 SDG 4: 优质教育
              </div>
              <div className="flex items-center gap-2 bg-blue-900/40 border border-blue-500/50 px-5 py-2.5 rounded-full text-blue-400 text-sm font-bold backdrop-blur-sm shadow-lg shadow-blue-900/20">
                 <Globe size={18} />
                 SDG 17: 促进目标实现的伙伴关系
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button onClick={() => setActiveTab(Tab.GAME)} className="px-10 py-5 bg-bio-primary hover:bg-sky-500 text-white rounded-full font-black text-xl shadow-xl shadow-sky-900/40 transition-all hover:scale-105 active:scale-95">
                进入作战室
              </button>
              <button onClick={() => setActiveTab(Tab.KNOWLEDGE)} className="px-10 py-5 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 rounded-full font-black text-xl transition-all hover:scale-105 active:scale-95 backdrop-blur">
                查阅档案库
              </button>
            </div>
          </div>
        );
      case Tab.KNOWLEDGE:
        return <KnowledgeBase />;
      case Tab.GAME:
        return <GameAssistant />;
      case Tab.AI:
        return (
          <div className="max-w-3xl mx-auto">
             <div className="mb-8 text-center">
               <h2 className="text-3xl font-black text-white tracking-tight">AI 生物战术顾问</h2>
               <p className="text-slate-400 mt-2">基于实时生物学大数据，为您提供规则分析与博弈策略</p>
             </div>
             <AIConsultant />
          </div>
        );
      default:
        return <div>请选择功能模块</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-bio-primary/30 selection:text-bio-highlight">
      {/* 导航栏 */}
      <nav className="border-b border-slate-800/60 bg-bio-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab(Tab.HOME)}>
              <div className="p-2 bg-bio-primary/20 rounded-lg group-hover:bg-bio-primary/30 transition-colors">
                <ShieldCheck className="text-bio-primary w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white leading-none">IMMUNE</span>
                <span className="text-[10px] text-bio-primary font-bold tracking-[0.2em]">WAR 免疫战争</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:flex gap-1 mr-4 border-r border-slate-800 pr-4">
                <NavButton active={activeTab === Tab.HOME} onClick={() => setActiveTab(Tab.HOME)} label="主页" />
                <NavButton active={activeTab === Tab.KNOWLEDGE} onClick={() => setActiveTab(Tab.KNOWLEDGE)} label="规则档案" icon={<Book size={18} />} />
                <NavButton active={activeTab === Tab.GAME} onClick={() => setActiveTab(Tab.GAME)} label="作战助手" icon={<LayoutDashboard size={18} />} />
                <NavButton active={activeTab === Tab.AI} onClick={() => setActiveTab(Tab.AI)} label="AI 顾问" icon={<MessageSquare size={18} />} />
              </div>

              <div className="md:hidden flex gap-1 mr-2">
                <IconButton active={activeTab === Tab.KNOWLEDGE} onClick={() => setActiveTab(Tab.KNOWLEDGE)} icon={<Book size={20} />} />
                <IconButton active={activeTab === Tab.GAME} onClick={() => setActiveTab(Tab.GAME)} icon={<LayoutDashboard size={20} />} />
                <IconButton active={activeTab === Tab.AI} onClick={() => setActiveTab(Tab.AI)} icon={<MessageSquare size={20} />} />
              </div>

              <button 
                onClick={toggleAudio}
                className={`p-3 rounded-xl transition-all ${isAudioEnabled ? 'bg-bio-primary/20 text-bio-primary shadow-lg shadow-bio-primary/10' : 'bg-slate-800 text-slate-500'}`}
                title={isAudioEnabled ? "关闭神经声学同步" : "开启神经声学同步"}
              >
                {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主体内容 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {renderContent()}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 py-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-sm flex items-center gap-4">
              <span>© 2026 免疫战争项目组</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-bio-primary font-semibold">支持联合国可持续发展目标</span>
            </div>
            <div className="flex gap-6">
               <span title="SDG 3"><HeartPulse size={20} className="text-green-500/50" /></span>
               <span title="SDG 4"><GraduationCap size={20} className="text-red-500/50" /></span>
               <span title="SDG 17"><Globe size={20} className="text-blue-500/50" /></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
      active ? 'bg-bio-primary text-white shadow-lg shadow-bio-primary/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const IconButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active ? 'bg-bio-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
  </button>
);

export default App;
