import React, { useState, useEffect } from 'react';
import { Player, RoleType, GamePhase, GameLog, GameStats } from './types';
import { ROLES } from './constants';
import { soundEngine } from './SoundEngine';
import { Play, Skull, Shield, Activity, UserCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GameAssistant: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [stats, setStats] = useState<GameStats[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<number[]>([]);
  const [commanderId, setCommanderId] = useState<number | null>(null);

  const addLog = (message: string, type: 'action' | 'system' | 'alert' = 'system') => {
    setLogs(prev => [{
      round,
      message,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      type
    }, ...prev]);
  };

  const initGame = () => {
    const rolesConfig = [
      RoleType.IMMUNE_CELL,
      RoleType.VIRUS, RoleType.VIRUS,
      RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL
    ];
    const shuffledRoles = [...rolesConfig].sort(() => Math.random() - 0.5);

    const initialPlayers: Player[] = [];
    for (let i = 0; i < 8; i++) {
      initialPlayers.push({
        id: i,
        pairId: Math.floor(i / 2) + 1,
        name: `玩家 ${i + 1}`,
        role: shuffledRoles[i],
        immunityExpiresRound: 0,
        statusEffects: []
      });
    }
    setPlayers(initialPlayers);
  };

  useEffect(() => {
    if (players.length === 0) initGame();
  }, []);

  const startGame = () => {
    soundEngine.playPhaseTransition();
    setRound(1);
    setPhase(GamePhase.ROUND_START);
    const randomCommander = Math.floor(Math.random() * 8);
    setCommanderId(randomCommander);
    addLog(`=== 战斗开始：第一轮监测开启 ===`, 'alert');
    updateStats(1);
  };

  const nextPhase = () => {
    soundEngine.playPhaseTransition();
    if (phase === GamePhase.ROUND_START) {
      setPhase(GamePhase.SEAT_SWAP);
      soundEngine.playVirusStealth(); 
      addLog("阶段一【细胞迁移】：指挥者提议换座。", 'action');
    } else if (phase === GamePhase.SEAT_SWAP) {
      setPhase(GamePhase.RESOLUTION);
      processInteractions();
    } else if (phase === GamePhase.RESOLUTION) {
      setPhase(GamePhase.ROUND_END);
      updateStats(round);
      checkVictory();
    } else if (phase === GamePhase.ROUND_END) {
      if (commanderId !== null) setCommanderId((commanderId + 1) % 8);
      setRound(r => r + 1);
      setPhase(GamePhase.ROUND_START);
    }
  };

  const checkVictory = () => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    if (virusCount === 0) {
      soundEngine.playVictory();
      addLog("🎉 最终胜利：病毒载量清零！", 'alert');
    } else if (virusCount >= 5) {
      addLog("⚠️ 失败：病毒扩散失控！", 'alert');
      soundEngine.playInfectionWarning();
    }
  };

  const updateStats = (currentRound: number) => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    const immuneCount = players.filter(p => p.role === RoleType.IMMUNE_CELL).length;
    const civilianCount = players.filter(p => p.role === RoleType.CIVILIAN_CELL).length;
    setStats(prev => [...prev, { round: currentRound, virusCount, immuneCellCount: immuneCount, civilianCount }]);
  };

  const executeSwap = () => {
    if (selectedForSwap.length !== 2) return;
    const p1 = players.find(p => p.id === selectedForSwap[0]);
    const p2 = players.find(p => p.id === selectedForSwap[1]);
    if (p1 && p2) {
      const p1Pair = p1.pairId;
      const p2Pair = p2.pairId;
      setPlayers(players.map(p => {
        if (p.id === p1.id) return { ...p, pairId: p2Pair };
        if (p.id === p2.id) return { ...p, pairId: p1Pair };
        return p;
      }));
      setSelectedForSwap([]);
      soundEngine.playPhaseTransition();
    }
  };

  const processInteractions = () => {
    const pairs: Record<number, Player[]> = { 1: [], 2: [], 3: [], 4: [] };
    players.forEach(p => pairs[p.pairId].push(p));
    Object.values(pairs).forEach((pairPlayers) => {
      if (pairPlayers.length !== 2) return;
      const immune = pairPlayers.find(p => p.role === RoleType.IMMUNE_CELL);
      const virus = pairPlayers.find(p => p.role === RoleType.VIRUS);
      if (immune && virus) {
        soundEngine.playImmuneAlert();
        cureVirus(virus.id);
      }
    });
  };

  const cureVirus = (playerId: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) return { ...p, role: RoleType.CIVILIAN_CELL, immunityExpiresRound: round + 1 };
      return p;
    }));
  };

  const infectPlayer = (targetId: number) => {
    const target = players.find(p => p.id === targetId);
    if (!target || target.immunityExpiresRound >= round) return;
    soundEngine.playInfectionWarning();
    setPlayers(prev => prev.map(p => {
      if (p.id === targetId) return { ...p, role: RoleType.VIRUS };
      return p;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-bio-primary/20 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white">{getPhaseLabel(phase)}</h2>
              {commanderId !== null && phase !== GamePhase.SETUP && (
                <div className="text-yellow-500 font-bold mt-2">指挥者：{players[commanderId]?.name}</div>
              )}
            </div>
            <div className="text-5xl font-black text-slate-800">R{round}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">区域 {id}</div>
                <div className="flex gap-4">
                  {players.filter(p => p.pairId === id).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => phase === GamePhase.SEAT_SWAP && setSelectedForSwap(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : prev.length < 2 ? [...prev, p.id] : prev)}
                      className={`flex-1 p-4 rounded-xl border transition-all ${selectedForSwap.includes(p.id) ? 'border-bio-primary bg-bio-primary/10' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800">
                          {p.role === RoleType.IMMUNE_CELL ? <Shield size={16} /> : p.role === RoleType.VIRUS ? <Skull size={16} /> : null}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300">{p.name}</span>
                        {phase === GamePhase.RESOLUTION && p.role === RoleType.CIVILIAN_CELL && players.some(partner => partner.pairId === id && partner.id !== p.id && partner.role === RoleType.VIRUS) && (
                          <button onClick={() => infectPlayer(p.id)} className="text-[8px] bg-red-600 px-2 py-1 rounded">感染</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-4">
            {phase === GamePhase.SETUP ? (
              <button onClick={startGame} className="px-8 py-4 bg-green-600 rounded-2xl font-black">启动协议</button>
            ) : (
              <div className="flex gap-4">
                {phase === GamePhase.SEAT_SWAP && selectedForSwap.length === 2 && (
                  <button onClick={executeSwap} className="px-6 py-4 bg-yellow-600 rounded-2xl font-black">确认交换</button>
                )}
                <button onClick={nextPhase} className="px-8 py-4 bg-bio-primary rounded-2xl font-black flex items-center gap-3">下一阶段 <Play size={20} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="round" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip />
              <Line type="monotone" dataKey="virusCount" stroke="#f43f5e" strokeWidth={3} />
              <Line type="monotone" dataKey="immuneCellCount" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 flex flex-col h-[750px] overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950 font-black text-xs">作战日志</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.map((log, i) => <div key={i} className="text-sm p-2 border-l-2 border-slate-700 bg-slate-800/20">{log.message}</div>)}
        </div>
      </div>
    </div>
  );
};

const getPhaseLabel = (phase: GamePhase) => {
  switch (phase) {
    case GamePhase.SETUP: return "系统部署";
    case GamePhase.ROUND_START: return "稳态监控";
    case GamePhase.SEAT_SWAP: return "细胞迁移";
    case GamePhase.RESOLUTION: return "识别结算";
    case GamePhase.ROUND_END: return "结果分析";
    default: return "未就绪";
  }
};

export default GameAssistant;
