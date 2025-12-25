import React, { useState } from 'react';
import { ROLES, GAME_OVERVIEW } from '../constants';
import { RoleType, RoleData } from '../types';
import { Shield, Skull, Users, BookOpen, Info, Globe2, Flag, Microscope, Target, Globe } from 'lucide-react';

interface MechanicItem {
  title: string;
  content: string;
}

interface SdgItem {
  id: string;
  title: string;
  desc: string;
}

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

  const rolesArray = Object.values(ROLES) as RoleData[];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BookOpen className="text-bio-highlight" />
          作战档案库
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic font-medium">
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
                ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Info className="w-8 h-8 text-purple-400" />
            <div>
              <div className="font-bold text-white">总体游戏机制</div>
              <div className="text-xs text-slate-500 font-bold">CORE RULES</div>
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
              <div className="font-bold text-white">游戏体现SDGs</div>
              <div className="text-xs text-slate-500 font-bold">SUSTAINABILITY</div>
            </div>
          </button>

          <div className="h-px bg-slate-800 my-4" />
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 font-black">角色图鉴</h3>

          {rolesArray.map((role: RoleData) => (
            <button
              key={role.id}
              onClick={() => setSelectedTab(role.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                selectedTab === role.id
                  ? 'bg-bio-primary/20 border-bio-primary shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                  : 'bg-bio-surface border-slate-700 hover:bg-slate-800'
              }`}
            >
              {getIcon(role.id)}
              <div>
                <div className="font-bold text-white">{role.name}</div>
                <div className="text-xs text-slate-500 font-bold">{role.faction}</div>
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
                  <h2 className="text-3xl font-bold text-white">{GAME_OVERVIEW.title}</h2>
                </div>
                {GAME_OVERVIEW.mechanics.map((mech: MechanicItem, idx: number) => (
                  <div key={idx} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-purple-300 font-bold mb-2 text-lg">{mech.title}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{mech.content}</p>
                  </div>
                ))}
              </div>
            ) : selectedTab === 'SDGS' ? (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  <Flag className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold text-white">可持续发展目标 (SDGs)</h2>
                </div>
                {GAME_OVERVIEW.sdgs.map((sdg: SdgItem, idx: number) => (
                  <div key={idx} className={`p-5 rounded-xl border ${getSdgStyles(sdg.id)}`}>
                    <div className="font-black text-2xl mb-1 opacity-80">{sdg.id}</div>
                    <div className="font-bold text-white mb-2 text-lg">{sdg.title}</div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{sdg.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-y-auto pr-4 custom-scrollbar h-full space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                  {getIcon(selectedTab as RoleType)}
                  <h2 className="text-3xl font-bold text-white">{ROLES[selectedTab as RoleType].name}</h2>
                </div>
                <div className="bg-gradient-to-r from-yellow-900/20 to-transparent p-5 rounded-xl border-l-4 border-yellow-500">
                  <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Target size={14} /> 胜利条件
                  </h3>
                  <p className="text-white font-bold text-lg">{ROLES[selectedTab as RoleType].victoryCondition}</p>
                </div>
                <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                  <h4 className="text-slate-400 font-bold mb-2 text-xs uppercase tracking-widest font-black">角色介绍</h4>
                  <p className="text-slate-200 text-sm leading-relaxed">{ROLES[selectedTab as RoleType].description}</p>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 italic">
                  <h4 className="text-bio-highlight font-bold mb-2 text-xs uppercase tracking-widest flex items-center gap-2 font-black">
                    <Microscope size={14} /> 生物学原理
                  </h4>
                  <p className="text-slate-400 text-sm">{ROLES[selectedTab as RoleType].bioConcept}</p>
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
