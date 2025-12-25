import React, { useState } from 'react';
import { ROLES, GAME_OVERVIEW } from '../constants';
import { RoleType } from '../types';
import { Shield, Skull, Users, BookOpen, ArrowRight, Microscope, Target, Info, Globe2, Flag, User, Zap, Globe } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<RoleType | 'OVERVIEW' | 'SDGS'>('OVERVIEW');

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BookOpen className="text-bio-highlight" />
          作战档案库
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          查阅游戏核心机制、角色胜利条件以及可持续发展目标（SDGs）愿景。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-lg font-semibold text-bio-primary uppercase tracking-wider mb-4 px-2">档案目录</h3>
          
          <button
            onClick={() => setSelectedTab('OVERVIEW')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
              selectedTab === 'OVERVIEW'
                ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-bio-surface border-slate-700 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <div className={`${selectedTab === 'OVERVIEW' ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
              <Info className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <div className={`font-bold ${selectedTab === 'OVERVIEW' ? 'text-white' : 'text-slate-300'}`}>总体游戏机制</div>
              <div className="text-xs text-slate-500 font-bold">游戏规则介绍</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedTab('SDGS')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
              selectedTab === 'SDGS'
                ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                : 'bg-bio-surface border-slate-700 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <div className={`${selectedTab === 'SDGS' ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className={`font-bold ${selectedTab === 'SDGS' ? 'text-white' : 'text-slate-300'}`}>游戏体现SDGs</div>
              <div className="text-xs text-slate-500 font-bold">可持续发展目标愿景</div>
            </div>
          </button>

          <div className="h-px bg-slate-800 my-4" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">角色图鉴</h3>

          {Object.values(ROLES).map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedTab(role.id as RoleType)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                selectedTab === role.id
                  ? 'bg-bio-primary/20 border-bio-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                  : 'bg-bio-surface border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <div className={`${selectedTab === role.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                {getIcon(role.id as RoleType)}
              </div>
              <div>
                <div className={`font-bold ${selectedTab === role.id ? 'text-white' : 'text-slate-300'}`}>{role.name}</div>
                <div className="text-xs text-slate-500">{role.faction}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 h-full">
          <div className="bg-bio-surface border border-slate-700 rounded-2xl p-8 h-full shadow-2xl relative overflow-hidden flex flex-col">
            
            {selectedTab === 'OVERVIEW' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-6 relative z-10">
                  <div className="p-4 bg-purple-900/30 rounded-2xl shadow-inner border border-purple-500/30">
                    <Globe2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{GAME_OVERVIEW.title}</h2>
                    <p className="text-slate-400 text-sm mt-1">{GAME_OVERVIEW.summary}</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                     {GAME_OVERVIEW.mechanics.map((mech, idx) => (
                       <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                         <h4 className="text-purple-300 font-bold mb-2 text-lg">{mech.title}</h4>
                         <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{mech.content}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            ) : selectedTab === 'SDGS' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-6 relative z-10">
                  <div className="p-4 bg-blue-900/30 rounded-2xl shadow-inner border border-blue-500/30">
                    <Flag className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">可持续发展目标 (SDGs)</h2>
                    <p className="text-slate-400 text-sm mt-1">项目愿景与社会责任</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 gap-4">
                    {GAME_OVERVIEW.sdgs.map((sdg, idx) => (
                      <div key={idx} className={`p-5 rounded-xl border ${getSdgStyles(sdg.id)} bg-opacity-10 transition-transform hover:scale-[1.01]`}>
                        <div className="font-black text-2xl mb-1 opacity-80">{sdg.id}</div>
                        <div className="font-bold text-white mb-2 text-lg">{sdg.title}</div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{sdg.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedTab ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bio-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-6 relative z-10">
                  <div className="p-4 bg-slate-900 rounded-2xl shadow-inner border border-slate-700">
                    {getIcon(selectedTab as RoleType)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{ROLES[selectedTab as RoleType].name}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      ROLES[selectedTab as RoleType].faction === '病毒阵营' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {ROLES[selectedTab as RoleType].faction}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-5 rounded-xl border-l-4 border-yellow-500">
                    <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                      <Target size={18} />
                      胜利条件
                    </h3>
                    <p className="text-white font-black text-lg">
                      {ROLES[selectedTab as RoleType].victoryCondition}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-slate-400 uppercase tracking-wide text-xs font-bold mb-3 flex items-center gap-2">
                      <User size={14} />
                      角色介绍
                    </h4>
                    <p className="text-slate-200 leading-relaxed">
                      {ROLES[selectedTab as RoleType].description}
                    </p>
                  </div>

                   <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-slate-400 uppercase tracking-wide text-xs font-bold mb-3 flex items-center gap-2">
                      <Zap size={14} />
                      特殊能力
                    </h4>
                    <p className="text-bio-primary font-bold text-lg">
                      {ROLES[selectedTab as RoleType].ability}
                    </p>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                       <Microscope size={64} />
                    </div>
                    <h3 className="text-bio-highlight font-bold mb-2 flex items-center gap-2 relative z-10">
                      <Microscope size={18} />
                      现实生物学原理
                    </h3>
                    <p className="text-slate-400 leading-relaxed italic relative z-10">
                      "{ROLES[selectedTab as RoleType].bioConcept}"
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;