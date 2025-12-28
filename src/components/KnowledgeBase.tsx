import React, { useState } from 'react';
import { ROLES, GAME_OVERVIEW, ADVANCED_RULES } from '../constants';
import { RoleType, RoleData } from '../types';
import { Shield, Skull, Users, BookOpen, Info, Globe2, Flag, Microscope, Target, Globe, Zap, AlertTriangle } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<RoleType | 'OVERVIEW' | 'SDGS' | 'ADVANCED'>('OVERVIEW');

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

  const rolesArray = Object.values(ROLES) as RoleData[];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3 uppercase tracking-tight">
          <BookOpen className="text-bio-highlight" />
          作战档案库
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic font-medium">
          查阅游戏核心机制、角色胜利条件以及可持续发展目标（SDGs）愿景。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-lg font-black text-bio-primary uppercase tracking-wider mb-4 px-2">档案目录 ARCHIVE</h3>
          
          <button
            onClick={() => setSelectedTab('OVERVIEW')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
              selectedTab === 'OVERVIEW'
                ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Info className="w-8 h-8 text-purple-400" />
            <div>
              <div className="font-bold text-white">基础游戏机制</div>
              <div className="text-[10px] text-slate-500 font-black">CORE RULES</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedTab('ADVANCED')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
              selectedTab === 'ADVANCED'
                ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-8 h-8 text-rose-400" />
            <div>
              <div className="font-bold text-white">进阶模式规则</div>
              <div className="text-[10px] text-slate-500 font-black">EXPANSION PACK</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedTab('SDGS')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
              selectedTab === 'SDGS'
                ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-8 h-8 text-blue-400" />
            <div>
              <div className="font-bold text-white">游戏体现 SDGs</div>
              <div className="text-[10px] text-slate-500 font-black">SUSTAINABILITY</div>
            </div>
          </button>

          <div className="h-px bg-slate-800 my-4" />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">角色图鉴 DATASETS</h3>

          {rolesArray.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedTab(role.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                selectedTab === role.id
                  ? 'bg-bio-primary/20 border-bio-primary shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                  : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
              }`}
            >
              {getIcon(role.id as RoleType)}
              <div>
                <div className="font-bold text-white">{role.name}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase">{role.faction}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 h-full">
          <div className="bg-bio-surface border border-slate-700 rounded-2xl p-8 h-full shadow-2xl overflow-hidden flex flex-col">
            
            {selectedTab === 'OVERVIEW' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  <Globe2 className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-black text-white">{GAME_OVERVIEW.title}</h2>
                </div>
                {GAME_OVERVIEW.mechanics.map((mech, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 transition-hover hover:border-purple-500/30">
                    <h4 className="text-purple-300 font-black mb-2 text-lg">{mech.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">{mech.content}</p>
                  </div>
                ))}
              </div>
            ) : selectedTab === 'ADVANCED' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  <Zap className="w-8 h-8 text-rose-400" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">进阶扩展：事件卡系统</h2>
                </div>
                <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded text-sm text-slate-300 font-medium">
                  {ADVANCED_RULES.summary}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ADVANCED_RULES.eventCards.map((card, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-rose-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <span className={`font-black text-lg ${card.colorClass}`}>{card.name}</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded bg-slate-800 font-black uppercase ${card.colorClass}`}>{card.type}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3 leading-relaxed">{card.effect}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 italic border-t border-slate-800 pt-2">
                         <Microscope size={12} className="text-bio-highlight" />
                         {card.bioLink}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="text-white font-black mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={18} /> 推理难度建议
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-2 font-medium">
                    <li>指挥者提议时，上帝应限制讨论时间为 3 分钟，增加决策压力。</li>
                    <li>病毒感染体细胞后，通过秘密确认（如手势）进行，增加潜伏隐蔽性。</li>
                    <li>当病毒载量达到 4 时，上帝应强制触发一张正面事件卡平衡局势。</li>
                  </ul>
                </div>
              </div>
            ) : selectedTab === 'SDGS' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  <Flag className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SDGs 可持续愿景</h2>
                </div>
                {GAME_OVERVIEW.sdgs.map((sdg, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border transition-all hover:scale-[1.01] ${getSdgStyles(sdg.id)}`}>
                    <div className="font-black text-2xl mb-1 opacity-80 tracking-tighter">{sdg.id}</div>
                    <div className="font-black text-white mb-2 text-lg">{sdg.title}</div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{sdg.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  {getIcon(selectedTab as RoleType)}
                  <h2 className="text-3xl font-black text-white">{ROLES[selectedTab as RoleType].name}</h2>
                </div>
                <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-5 rounded-xl border-l-4 border-yellow-500">
                  <h3 className="text-yellow-400 font-black mb-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <Target size={14} /> 胜利条件 VICTORY CONDITION
                  </h3>
                  <p className="text-white font-bold text-lg">{ROLES[selectedTab as RoleType].victoryCondition}</p>
                </div>
                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                  <h4 className="text-slate-400 font-black mb-2 text-[10px] uppercase tracking-widest">角色介绍 PROFILE</h4>
                  <p className="text-slate-200 text-sm leading-relaxed font-medium">{ROLES[selectedTab as RoleType].description}</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 italic">
                  <h4 className="text-bio-highlight font-black mb-2 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Microscope size={14} /> 生物学原理 SCIENTIFIC BASIS
                  </h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{ROLES[selectedTab as RoleType].bioConcept}</p>
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
