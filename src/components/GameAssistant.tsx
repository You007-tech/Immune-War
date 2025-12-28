
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
  // Fix: change selectedForSwap from number[] to string[] to match Player.id type (string)
  const [selectedForSwap, setSelectedForSwap] = useState<string[]>([]);
  // Fix: change commanderId from number | null to string | null to match Player.id type (string)
  const [commanderId, setCommanderId] = useState<string | null>(null);

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
        // Fix: Ensure player ID is a string to match the Player interface in types.ts
        id: String(i),
        pairId: Math.floor(i / 2) + 1,
        name: `玩家 ${i + 1}`,
        role: shuffledRoles[i],
        immunityExpiresRound: 0,
        statusEffects: []
      });
    }
    setPlayers(initialPlayers);
    addLog("生物神经网络初始化完成。8名玩家已分配角色。", 'system');
  };

  useEffect(() => {
    if (players.length === 0) initGame();
  }, []);

  const startGame = () => {
    soundEngine.playPhaseTransition();
    setRound(1);
    setPhase(GamePhase.ROUND_START);
    const randomCommander = Math.floor(Math.random() * 8);
    // Fix: Store commanderId as a string
    setCommanderId(String(randomCommander));
    addLog(`=== 战斗开始：第一轮监测开启 ===`, 'alert');
    addLog(`本轮“指挥者”为：玩家 ${randomCommander + 1}`, 'system');
    updateStats(1);
  };

  const nextPhase = () => {
    soundEngine.playPhaseTransition();
    if (phase === GamePhase.ROUND_START) {
      setPhase(GamePhase.SEAT_SWAP);
      soundEngine.playVirusStealth(); 
      addLog("阶段一【细胞迁移】：指挥者提议换座方案。", 'action');
    } else if (phase === GamePhase.SEAT_SWAP) {
      setPhase(GamePhase.RESOLUTION);
      addLog("阶段二【特异性识别】：结算接触后果...", 'action');
      processInteractions();
    } else if (phase === GamePhase.RESOLUTION) {
      setPhase(GamePhase.ROUND_END);
      updateStats(round);
      checkVictory();
    } else if (phase === GamePhase.ROUND_END) {
      // Fix: Safely increment commanderId by converting string to number and back to string
      if (commanderId !== null) setCommanderId(String((Number(commanderId) + 1) % 8));
      setRound(r => r + 1);
      setPhase(GamePhase.ROUND_START);
      addLog(`=== 第 ${round + 1} 轮扫描开启 ===`, 'alert');
    }
  };

  const checkVictory = () => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    addLog(`阶段三【信息公布】：场上活性病毒总数为 ${virusCount}。`, 'system');
    if (virusCount === 0) {
      soundEngine.playVictory();
      addLog("🎉 最终胜利：病毒载量清零！机体免疫系统胜利。", 'alert');
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
    // Fix: IDs are now strings, so comparison with p.id (string) is correct
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
      addLog(`执行方案：${p1.name} 与 ${p2.name} 交换位置。`, 'action');
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

  // Fix: Changed parameter type from number to string to match Player.id
  const cureVirus = (playerId: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) return { ...p, role: RoleType.CIVILIAN_CELL, immunityExpiresRound: round + 1 };
      return p;
    }));
    const pName = players.find(p => p.id === playerId)?.name;
    addLog(`【特异性治愈】免疫系统成功清除了 ${pName} 携带的病毒。`, 'action');
  };

  // Fix: Changed parameter type from number to string to match Player.id
  const infectPlayer = (targetId: string) => {
    const target = players.find(p => p.id === targetId);
    if (!target) return;
    if (target.immunityExpiresRound >= round) {
       addLog(`【免疫记忆】${target.name} 尚处保护期，无法被感染。`, 'alert');
       return;
    }
    soundEngine.playInfectionWarning();
    setPlayers(prev => prev.map(p => {
      if (p.id === targetId) return { ...p, role: RoleType.VIRUS };
      return p;
    }));
    addLog(`【新感染警报】${target.name} 已被感染。`, 'alert');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-bio-primary/20 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{getPhaseLabel(phase)}</h2>
              {commanderId !== null && phase !== GamePhase.SETUP && (
                <div className="text-yellow-500 font-bold mt-2 flex items-center gap-2">
                  <UserCircle size={18} />
                  {/* Fix: Find the commander by their string ID */}
                  <span>当前指挥者：{players.find(p => p.id === commanderId)?.name}</span>
                </div>
              )}
            </div>
            <div className="text-5xl font-black text-slate-800">R{round < 10 ? `0${round}` : round}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest border-b border-slate-700 pb-2">区域 {id}</div>
                <div className="flex gap-4">
                  {players.filter(p => p.pairId === id).map(p => (
                    <div 
                      key={p.id}
                      // Fix: correctly handle state update with string IDs and string comparison
                      onClick={() => phase === GamePhase.SEAT_SWAP && setSelectedForSwap(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : prev.length < 2 ? [...prev, p.id] : prev)}
                      className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer relative ${selectedForSwap.includes(p.id) ? 'border-bio-primary bg-bio-primary/10' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.role === RoleType.IMMUNE_CELL ? 'bg-blue-500/10 text-blue-400' : p.role === RoleType.VIRUS ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                          {p.role === RoleType.IMMUNE_CELL ? <Shield size={16} /> : p.role === RoleType.VIRUS ? <Skull size={16} /> : <div className="text-[8px] font-bold">CELL</div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 truncate w-full">{p.name}</span>
                        {p.immunityExpiresRound >= round && round > 0 && <Shield size={10} className="text-green-500 absolute top-2 right-2" />}
                        {phase === GamePhase.RESOLUTION && p.role === RoleType.CIVILIAN_CELL && players.some(partner => partner.pairId === id && partner.id !== p.id && partner.role === RoleType.VIRUS) && (
                          <button onClick={(e) => { e.stopPropagation(); infectPlayer(p.id); }} className="text-[8px] bg-red-600 px-2 py-1 rounded text-white font-bold mt-1 hover:bg-red-500">感染</button>
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
              <button onClick={startGame} className="px-8 py-4 bg-green-600 rounded-2xl font-black hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-900/20">启动仿真协议</button>
            ) : (
              <div className="flex gap-4">
                {phase === GamePhase.SEAT_SWAP && selectedForSwap.length === 2 && (
                  <button onClick={executeSwap} className="px-6 py-4 bg-yellow-600 rounded-2xl font-black hover:bg-yellow-500 transition-all active:scale-95">确认迁移</button>
                )}
                <button onClick={nextPhase} className="px-8 py-4 bg-bio-primary rounded-2xl font-black flex items-center gap-3 hover:bg-sky-500 transition-all active:scale-95 shadow-lg shadow-sky-900/20">
                  {phase === GamePhase.ROUND_END ? "开启下轮稳态扫描" : "进入下一阶段"} <Play size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 h-[300px] shadow-xl">
           <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">流行病学趋势监控</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="round" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="virusCount" name="病毒载量" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="immuneCellCount" name="免疫防御力" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 flex flex-col h-[750px] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950 font-black text-xs tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Activity size={14} className="text-bio-primary" /> 作战日志终端
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {logs.length === 0 && <div className="text-slate-600 text-xs italic text-center mt-10">等待系统日志流同步...</div>}
          {logs.map((log, i) => (
            <div key={i} className={`text-sm p-3 rounded-xl border-l-4 shadow-sm transition-all animate-fade-in ${log.type === 'alert' ? 'border-red-500 bg-red-500/5' : 'border-bio-primary bg-bio-primary/5'}`}>
              <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-bold">
                <span>{log.timestamp}</span>
                <span className="text-bio-primary">ROUND {log.round}</span>
              </div>
              <div className="text-slate-200 font-medium leading-relaxed">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPhaseLabel = (phase: GamePhase) => {
  switch (phase) {
    case GamePhase.SETUP: return "系统部署 DEPLOYMENT";
    case GamePhase.ROUND_START: return "稳态监控 MONITORING";
    case GamePhase.SEAT_SWAP: return "细胞迁移 MIGRATION";
    case GamePhase.RESOLUTION: return "识别结算 RESPONSE";
    case GamePhase.ROUND_END: return "结果分析 ANALYSIS";
    default: return "未就绪 UNREADY";
  }
};

export default GameAssistant;
