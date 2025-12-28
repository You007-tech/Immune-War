import React, { useState } from 'react';
import { ROLES, GAME_OVERVIEW, ADVANCED_RULES } from '../constants';
import { RoleType, RoleData } from '../types';
import { Shield, Skull, Users, BookOpen, Info, Globe2, Flag, Microscope, Target, Globe, Zap, AlertTriangle, ChevronDown } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<RoleType | 'OVERVIEW' | 'SDGS' | 'ADVANCED'>('OVERVIEW');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getIcon = (roleId: RoleType) => {
    switch (roleId) {
      case RoleType.IMMUNE_CELL: return <Shield className="w-8 h-8 text-blue-400" />;
      case RoleType.VIRUS: return <Skull className="w-8 h-8 text-red-500" />;
      case RoleType.CIVILIAN_CELL: return <Users className="w-8 h-8 text-green-400" />;
      default: return <Users className="w-8 h-8 text-slate-400" />;
    }
  };

  const getSdgStyles = (id: string) => {
    if (id === 'SDG 3') return 'bg-green-900/20 border-green-700 text-green-400';
    if (id === 'SDG 4') return 'bg-red-900/20 border-red-700 text-red-400';
    if (id === 'SDG 17') return 'bg-blue-900/20 border-blue-700 text-blue-400';
    return 'bg-slate-900/20 border-slate-700 text-slate-400';
  };

  const getCurrentTabLabel = () => {
    if (selectedTab === 'OVERVIEW') return '基础游戏机制';
    if (selectedTab === 'ADVANCED') return '进阶模式规则';
    if (selectedTab === 'SDGS') return '游戏体现SDGs';
    return ROLES[selectedTab as RoleType]?.name || '未知';
  };

  const rolesArray = Object.values(ROLES) as RoleData[];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 flex items-center justify-center gap-3 uppercase tracking-tighter">
          <BookOpen className="text-bio-highlight" />
          作战档案库 ARCHIVE
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic font-medium tracking-wide px-4 text-sm md:text-base">
          查阅游戏核心机制、角色胜利条件以及可持续发展目标 (SDGs) 愿景。
        </p>
      </div>

      {/* 移动端下拉菜单 - 只在中小屏幕显示 */}
      <div className="block lg:hidden mb-6">
        <div className="relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-bio-surface border border-slate-700 rounded-xl p-4 flex items-center justify-between group hover:bg-slate-800 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-bio-primary/20 rounded-lg">
                {selectedTab === 'OVERVIEW' ? <Info className="w-5 h-5 text-purple-400" /> :
                 selectedTab === 'ADVANCED' ? <Zap className="w-5 h-5 text-rose-400" /> :
                 selectedTab === 'SDGS' ? <Globe className="w-5 h-5 text-blue-400" /> :
                 getIcon(selectedTab as RoleType)}
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm">{getCurrentTabLabel()}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase">
                  {selectedTab === 'OVERVIEW' ? 'CORE RULES' :
                   selectedTab === 'ADVANCED' ? 'EXPANSION' :
                   selectedTab === 'SDGS' ? 'SUSTAINABILITY' :
                   ROLES[selectedTab as RoleType]?.faction || ''}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* 下拉菜单内容 */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-bio-surface border border-slate-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto custom-scrollbar">
              {/* 主要分类 */}
              <div className="p-2">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-3">档案目录</div>
                <button
                  onClick={() => { setSelectedTab('OVERVIEW'); setMobileMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-3 ${selectedTab === 'OVERVIEW' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Info className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-bold text-sm">基础游戏机制</div>
                    <div className="text-[10px] text-slate-500 font-black">CORE RULES</div>
                  </div>
                </button>
                
                <button
                  onClick={() => { setSelectedTab('ADVANCED'); setMobileMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-3 ${selectedTab === 'ADVANCED' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Zap className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="font-bold text-sm">进阶模式规则</div>
                    <div className="text-[10px] text-slate-500 font-black">EXPANSION</div>
                  </div>
                </button>
                
                <button
                  onClick={() => { setSelectedTab('SDGS'); setMobileMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded-lg mb-3 flex items-center gap-3 ${selectedTab === 'SDGS' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Globe className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-bold text-sm">游戏体现 SDGs</div>
                    <div className="text-[10px] text-slate-500 font-black">SUSTAINABILITY</div>
                  </div>
                </button>
                
                <div className="h-px bg-slate-800 my-2" />
                
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-3">细胞角色图鉴</div>
                {rolesArray.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => { setSelectedTab(role.id as RoleType); setMobileMenuOpen(false); }}
                    className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-3 ${selectedTab === role.id ? 'bg-bio-primary/20 text-bio-primary' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    {getIcon(role.id as RoleType)}
                    <div>
                      <div className="font-bold text-sm">{role.name}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase">{role.faction}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="block lg:grid lg:grid-cols-3 gap-6 h-auto lg:h-[700px]">
        {/* 桌面端左侧目录 - 只在桌面端显示 */}
        <div className="hidden lg:flex flex-col lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-lg font-black text-bio-primary uppercase tracking-widest mb-4 px-2">档案目录</h3>
          
          <button onClick={() => setSelectedTab('OVERVIEW')} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${selectedTab === 'OVERVIEW' ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-bio-surface border-slate-700 hover:bg-slate-800'}`}>
            <Info className="w-8 h-8 text-purple-400" />
            <div><div className="font-bold text-white tracking-tight">基础游戏机制</div><div className="text-[10px] text-slate-500 font-black uppercase">CORE RULES</div></div>
          </button>

          <button onClick={() => setSelectedTab('ADVANCED')} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${selectedTab === 'ADVANCED' ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-bio-surface border-slate-700 hover:bg-slate-800'}`}>
            <Zap className="w-8 h-8 text-rose-400" />
            <div><div className="font-bold text-white tracking-tight">进阶模式规则</div><div className="text-[10px] text-slate-500 font-black uppercase">EXPANSION</div></div>
          </button>

          <button onClick={() => setSelectedTab('SDGS')} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${selectedTab === 'SDGS' ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-bio-surface border-slate-700 hover:bg-slate-800'}`}>
            <Globe className="w-8 h-8 text-blue-400" />
            <div><div className="font-bold text-white tracking-tight">游戏体现 SDGs</div><div className="text-[10px] text-slate-500 font-black uppercase">SUSTAINABILITY</div></div>
          </button>

          <div className="h-px bg-slate-800 my-4 opacity-50" />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-2">细胞角色图鉴</h3>
          {rolesArray.map((role) => (
            <button key={role.id} onClick={() => setSelectedTab(role.id)} className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${selectedTab === role.id ? 'bg-bio-primary/20 border-bio-primary shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-bio-surface border-slate-700 hover:bg-slate-800'}`}>
              {getIcon(role.id as RoleType)}
              <div><div className="font-bold text-white tracking-tight">{role.name}</div><div className="text-[10px] text-slate-500 font-black uppercase">{role.faction}</div></div>
            </button>
          ))}
        </div>

        {/* 右侧内容区域 - 在桌面端占2列，在移动端占全宽 */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-bio-surface border border-slate-700 rounded-2xl p-6 md:p-8 h-full shadow-2xl overflow-hidden flex flex-col">
            {selectedTab === 'OVERVIEW' ? (
              <div className="overflow-y-auto pr-2 md:pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-4 md:pb-6 transition-all duration-500">
                  <Globe2 className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
                    {GAME_OVERVIEW.title}
                  </h2>
                </div>
                {GAME_OVERVIEW.mechanics.map((mech, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-4 md:p-5 rounded-xl border border-slate-700 transition-all hover:border-purple-500/30 group">
                    <h4 className="text-purple-300 font-black mb-2 text-base md:text-lg tracking-tight group-hover:text-purple-200 transition-colors">
                      {mech.title}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {mech.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : selectedTab === 'ADVANCED' ? (
              <div className="overflow-y-auto pr-2 md:pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-4 md:pb-6">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-rose-400" />
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
                    进阶扩展：上帝机制与事件
                  </h2>
                </div>
                <div className="bg-rose-500/10 border-l-4 border-rose-500 p-3 md:p-4 text-sm text-slate-300 font-medium leading-relaxed">
                  {ADVANCED_RULES.summary}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ADVANCED_RULES.eventCards.map((card: any, idx: number) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-xl hover:border-rose-500/50 transition-all shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-black text-base md:text-lg tracking-tight ${card.colorClass}`}>
                          {card.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded bg-slate-800 font-black tracking-widest ${card.colorClass}`}>
                          {card.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3 font-medium leading-relaxed">
                        {card.effect}
                      </p>
                      <div className="text-[10px] text-slate-500 italic border-t border-slate-800 pt-2 flex items-center gap-2">
                        <Microscope size={12} className="opacity-50" />
                        {card.bioLink}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedTab === 'SDGS' ? (
              <div className="overflow-y-auto pr-2 md:pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-4 md:pb-6">
                  <Flag className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
                    SDGs 可持续发展愿景
                  </h2>
                </div>
                {GAME_OVERVIEW.sdgs.map((sdg, idx) => (
                  <div key={idx} className={`p-4 md:p-6 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${getSdgStyles(sdg.id)}`}>
                    <div className="font-black text-xl md:text-2xl mb-1 opacity-80 tracking-tighter">
                      {sdg.id}
                    </div>
                    <div className="font-black text-white mb-2 text-base md:text-lg tracking-tight">
                      {sdg.title}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      {sdg.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-y-auto pr-2 md:pr-4 custom-scrollbar h-full space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-4 md:pb-6">
                  {getIcon(selectedTab as RoleType)}
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
                    {ROLES[selectedTab as RoleType].name}
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-4 md:p-5 rounded-xl border-l-4 border-yellow-500 shadow-lg">
                  <h3 className="text-yellow-400 font-black mb-2 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target size={14} /> 胜利条件 VICTORY
                  </h3>
                  <p className="text-white font-bold text-base md:text-lg tracking-tight">
                    {ROLES[selectedTab as RoleType].victoryCondition}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-4 md:p-5 rounded-xl border border-slate-700 shadow-sm">
                  <h4 className="text-slate-400 font-black mb-2 text-[10px] uppercase tracking-[0.2em]">
                    角色简述 PROFILE
                  </h4>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed">
                    {ROLES[selectedTab as RoleType].description}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 md:p-6 rounded-xl border border-slate-800 italic font-medium shadow-inner">
                  <h4 className="text-bio-highlight font-black mb-2 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Microscope size={14} /> 生物学原理 SCI BASIS
                  </h4>
                  <p className="text-slate-400 text-[13px] leading-relaxed">
                    {ROLES[selectedTab as RoleType].bioConcept}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
