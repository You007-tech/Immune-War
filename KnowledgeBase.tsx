import React, { useState } from 'react';
import { ROLES, GAME_OVERVIEW } from './constants';
import { RoleType, RoleData } from './types';
import { Shield, Skull, Users, BookOpen, Info, Globe2, Flag, Microscope, Target, Globe } from 'lucide-react';

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

  const rolesArray = Object.values(ROLES) as RoleData[];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <BookOpen className="text-bio-highlight" />作战档案库
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <button onClick={() => setSelectedTab('OVERVIEW')} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTab === 'OVERVIEW' ? 'border-purple-400 bg-purple-500/10' : 'border-slate-700'}`}>
            <div className="font-bold">总体游戏机制</div>
          </button>
          <button onClick={() => setSelectedTab('SDGS')} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTab === 'SDGS' ? 'border-blue-400 bg-blue-500/10' : 'border-slate-700'}`}>
            <div className="font-bold">游戏体现SDGs</div>
          </button>
          <div className="h-px bg-slate-800 my-4" />
          {rolesArray.map((role) => (
            <button key={role.id} onClick={() => setSelectedTab(role.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTab === role.id ? 'border-bio-primary bg-bio-primary/10' : 'border-slate-700'}`}>
              <div className="font-bold">{role.name}</div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 h-full bg-bio-surface border border-slate-700 rounded-2xl p-8 overflow-y-auto">
          {selectedTab === 'OVERVIEW' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{GAME_OVERVIEW.title}</h2>
              {GAME_OVERVIEW.mechanics.map((m, i) => <div key={i} className="p-4 bg-slate-900 rounded-xl"><strong>{m.title}</strong><p className="mt-2 text-sm text-slate-300">{m.content}</p></div>)}
            </div>
          ) : selectedTab === 'SDGS' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">SDGs 愿景</h2>
              {GAME_OVERVIEW.sdgs.map((s, i) => <div key={i} className="p-4 bg-slate-900 rounded-xl"><strong>{s.id}: {s.title}</strong><p className="mt-2 text-sm text-slate-300">{s.desc}</p></div>)}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">{ROLES[selectedTab as RoleType].name}</h2>
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/10"><strong>胜利条件</strong><p>{ROLES[selectedTab as RoleType].victoryCondition}</p></div>
              <div className="p-4 bg-slate-800 rounded-xl"><strong>角色介绍</strong><p className="text-sm">{ROLES[selectedTab as RoleType].description}</p></div>
              <div className="p-4 bg-slate-950 rounded-xl italic"><strong>生物学原理</strong><p className="text-sm text-slate-400">{ROLES[selectedTab as RoleType].bioConcept}</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
